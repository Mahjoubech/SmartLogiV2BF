import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import LoginForm from '../../auth/components/LoginForm';

const HomePage: React.FC = () => {
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    
    useEffect(() => {
        if (location.pathname === '/login') {
            setIsLoginOpen(true);
        }
    }, [location]);

    
    useEffect(() => {
        const handleScroll = () => {
             setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    return (
        <div className="font-sans antialiased text-slate-800 bg-stone-50 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden relative">
            
            {}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md h-20' : 'bg-transparent h-24'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex items-center gap-2">
                             <div className={`w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-xl border transition-all ${scrolled ? 'bg-orange-600 text-white border-orange-600' : 'bg-white/10 text-white border-white/20'}`}>
                                S
                            </div>
                            <span className={`text-xl font-bold tracking-tight drop-shadow-md transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                SMART<span className="text-orange-500">LOGI</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#services" className={`text-sm font-bold transition ${scrolled ? 'text-slate-600 hover:text-orange-600' : 'text-white/80 hover:text-white'}`}>Services</a>
                            <a href="#tracking" className={`text-sm font-bold transition ${scrolled ? 'text-slate-600 hover:text-orange-600' : 'text-white/80 hover:text-white'}`}>Trucking & Tracking</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={openLogin} 
                                className={`text-sm font-bold transition ${scrolled ? 'text-slate-600 hover:text-orange-600' : 'text-white hover:text-orange-400'}`}
                            >
                                Log In
                            </button>
                            <Link to="/register">
                                <Button 
                                    variant="primary" 
                                    className="rounded-full px-6 py-2.5 text-sm shadow-orange-500/20"
                                >
                                    Open Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {}
            <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
                {}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105"
                    style={{ backgroundImage: "url('/assets/images/hero-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-[-10vh]">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Next Generation Logistics
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8 drop-shadow-2xl">
                        Delivery <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Reinvented.</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
                        Connecting businesses and customers with the most advanced, secure, and real-time delivery network in the world.
                    </p>
                    
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <button className="bg-orange-600 hover:bg-orange-500 text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg shadow-orange-500/40 transition-all transform hover:scale-105 active:scale-95 border-2 border-transparent">
                                Get Started
                            </button>
                        </Link>
                        <a href="#tracking">
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/30 text-lg font-bold px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95">
                                Track Shipment
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {}
            <section id="services" className="py-24 bg-white relative">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-3">Our Expertise</h2>
                        <h3 className="text-4xl font-black text-slate-900 mb-4">Premium Logistics Services</h3>
                        <p className="text-slate-500 max-w-2xl mx-auto">Tailored solutions for businesses of all sizes, from instant local courier to global freight forwarding.</p>
                     </div>

                     <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Express Delivery', desc: 'Same-day delivery for urgent shipments within the city limits.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { title: 'Freight Forwarding', desc: 'Secure and efficient transport for bulk cargo across the country.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                            { title: 'Warehousing', desc: 'State-of-the-art storage facilities with real-time inventory management.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        ].map((service, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon}></path></svg>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                     </div>
                 </div>
            </section>

            {}
            <section id="tracking" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900/30 via-slate-900 to-slate-900"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                Live Fleet Status
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black mb-6">Smart Fleet & <br/><span className="text-orange-500">Real-Time Tracking</span></h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Our modern fleet of eco-friendly vehicles is equipped with advanced GPS and telemetry systems, ensuring your package is always visible and on time.
                            </p>
                            
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    Track Your Shipment
                                </h3>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Tracking ID" 
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                                    />
                                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition">
                                        Track
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative">
                             {}
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/5 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 rounded-xl">
                                        <div className="text-3xl font-black text-white mb-1">1,240</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Active Trucks</div>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl">
                                        <div className="text-3xl font-black text-green-500 mb-1">98%</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">On-Time Rate</div>
                                    </div>
                                    {[
                         { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant Quote", desc: "Get rates in seconds" },
                         { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Real-time Tracking", desc: "GPS precision updates" },
                         { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure Cargo", desc: "Insured & Verified" }
                     ].map((item) => (
                         <div key={item.title} className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-64 text-left hover:bg-black/60 transition cursor-default">
                             <svg className="w-8 h-8 text-orange-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                             <h4 className="text-white font-bold">{item.title}</h4>
                             <p className="text-white/60 text-sm">{item.desc}</p>
                         </div>
                     ))}
                                    <div className="col-span-2 bg-gradient-to-r from-orange-600 to-orange-500 p-6 rounded-xl flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-bold text-lg">Join the Fleet</div>
                                            <div className="text-orange-100 text-sm">Become a driver partner</div>
                                        </div>
                                        <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


             {}
            <div 
                className={`fixed inset-x-0 bottom-0 z-[60] transform transition-transform duration-500 ease-spring ${isLoginOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                 <div className="absolute top-0 left-0 right-0 -mt-12 flex justify-center pb-2 pointer-events-none">
                     <div className="w-16 h-1 bg-white/50 rounded-full"></div>
                 </div>

                <div className="bg-white rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] p-8 md:p-12 relative max-h-[90vh] overflow-y-auto">
                    <button 
                        onClick={closeLogin}
                        className="absolute top-8 right-8 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition"
                    >
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <LoginForm onSuccess={closeLogin} switchToRegister={() => window.location.href = '/register'} />
                </div>
            </div>

            {}
            {isLoginOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[55] transition-opacity" 
                    onClick={closeLogin}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeLogin(); }}
                    aria-label="Close Login Drawer"
                ></div>
            )}

        </div>
    );
};

export default HomePage;
