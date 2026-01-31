import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Calendar, Clock } from 'lucide-react';

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();

        // Request Notification Permission
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // Realtime Subscription
        const subscription = supabase
            .channel('leads_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
                const newLead = payload.new;
                setLeads((current) => [newLead, ...current]);

                // Send Notification
                if (Notification.permission === 'granted') {
                    new Notification('New Lead!', {
                        body: `${newLead.name} needs ${newLead.requirement}`,
                        icon: '/vite.svg'
                    });
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency?.toLowerCase()) {
            case 'asap': return '#FF3B30';
            case 'this week': return '#FF9500';
            default: return '#34C759';
        }
    };

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>Loading leads...</div>;
    }

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <h1 className="title">Leads</h1>

            {leads.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#666' }}>No leads yet.</p>
                </div>
            ) : (
                leads.map((lead) => (
                    <div key={lead.id} className="card" style={{ position: 'relative' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{lead.name}</h3>
                                <p style={{ fontSize: '13px', color: '#666' }}>{lead.business}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    backgroundColor: '#F2F2F7',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Clock size={11} />
                                    {formatDateTime(lead.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: getUrgencyColor(lead.urgency),
                                backgroundColor: `${getUrgencyColor(lead.urgency)}15`,
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                {lead.urgency || 'Flexible'}
                            </span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#007AFF',
                                backgroundColor: '#007AFF15',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                {lead.status || 'New'}
                            </span>
                        </div>

                        {/* Body */}
                        <div style={{ fontSize: '14px', color: '#333', marginBottom: '16px', lineHeight: '1.4' }}>
                            {lead.requirement}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a href={`tel:${lead.phone}`} className="btn" style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                backgroundColor: '#34C759'
                            }}>
                                <Phone size={16} />
                                Call
                            </a>
                            <button className="btn" style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                backgroundColor: '#F2F2F7',
                                color: '#000',
                                flex: 1
                            }}>
                                Details
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
