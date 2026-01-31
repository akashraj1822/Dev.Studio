import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MoreHorizontal, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProjects(data || []);
        setLoading(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={16} color="#34C759" />;
            case 'In Progress': return <Clock size={16} color="#007AFF" />;
            default: return <XCircle size={16} color="#FF3B30" />;
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 className="title" style={{ marginBottom: 0 }}>Projects</h1>
                <button className="btn" style={{ width: 'auto', padding: '10px', borderRadius: '50%' }}>
                    <Plus size={24} />
                </button>
            </div>

            {projects.length === 0 && !loading && (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#666' }}>No active projects.</p>
                </div>
            )}

            {projects.map(project => (
                <div key={project.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{project.client_name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                {getStatusIcon(project.status)}
                                <span>{project.status}</span>
                            </div>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: '#C7C7CC' }}>
                            <MoreHorizontal />
                        </button>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '500' }}>
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${project.progress}%`,
                                height: '100%',
                                backgroundColor: project.status === 'Completed' ? '#34C759' : '#007AFF',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                        <div style={{ color: '#666' }}>
                            {project.advance_received ? 'Advance Paid' : 'Pending Advance'}
                        </div>
                        <div style={{ fontWeight: '600' }}>₹{project.price?.toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
