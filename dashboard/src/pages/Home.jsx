import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Folder, DollarSign } from 'lucide-react';

export default function Home() {
    const [stats, setStats] = useState({ leads: 0, projects: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    // Dummy data for charts (until we have enough real data)
    const chartData = [
        { name: 'Jan', value: 4 },
        { name: 'Feb', value: 3 },
        { name: 'Mar', value: 5 },
        { name: 'Apr', value: 2 },
        { name: 'May', value: 8 },
        { name: 'Jun', value: 12 },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Parallel fetching for speed
            const [leadsRes, projectsRes, paymentsRes] = await Promise.all([
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'In Progress'),
                supabase.from('payments').select('amount')
            ]);

            const totalRevenue = paymentsRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

            setStats({
                leads: leadsRes.count || 0,
                projects: projectsRes.count || 0,
                revenue: totalRevenue,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card" style={{ flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: `${color}15`, color: color }}>
                    <Icon size={18} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <h1 className="title">Overview</h1>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <StatCard icon={Users} label="Total Leads" value={stats.leads} color="#007AFF" />
                <StatCard icon={Folder} label="Active Projects" value={stats.projects} color="#FF9500" />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <StatCard icon={DollarSign} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="#34C759" />
            </div>

            {/* Charts */}
            <div className="card">
                <div className="subtitle">Leads Trend</div>
                <div style={{ height: '200px', width: '100%', paddingRight: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" stroke="#C7C7CC" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'rgba(0,0,0,0.1) 0px 4px 12px' }}
                                cursor={{ stroke: '#E5E5EA', strokeWidth: 2 }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#007AFF" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <div className="subtitle">Revenue</div>
                <div style={{ height: '200px', width: '100%', paddingRight: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#C7C7CC" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#F2F2F7' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'rgba(0,0,0,0.1) 0px 4px 12px' }}
                            />
                            <Bar dataKey="value" fill="#34C759" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
