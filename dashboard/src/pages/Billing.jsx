import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, ArrowDownLeft, FileText, Download } from 'lucide-react';

export default function Billing() {
    const [payments, setPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('date', { ascending: false });

        if (!error) {
            setPayments(data || []);
            const total = (data || []).reduce((sum, p) => sum + (p.amount || 0), 0);
            setTotalRevenue(total);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <h1 className="title">Billing</h1>

            <div className="card" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #0056B3 100%)', color: 'white' }}>
                <div style={{ opacity: 0.8, fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Total Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: '700' }}>₹{totalRevenue.toLocaleString()}</div>
            </div>

            <div className="subtitle" style={{ marginTop: '24px' }}>Transaction History</div>

            {payments.length === 0 && (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>No transactions recorded.</p>
                </div>
            )}

            {payments.map(payment => (
                <div key={payment.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: payment.type === 'Final' ? '#E8FAE0' : '#E5F1FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: payment.type === 'Final' ? '#34C759' : '#007AFF'
                        }}>
                            {payment.type === 'Final' ? <ArrowDownLeft size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '16px' }}>{payment.type} Payment</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>Via {payment.method} • {formatDate(payment.date)}</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        +₹{payment.amount?.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
