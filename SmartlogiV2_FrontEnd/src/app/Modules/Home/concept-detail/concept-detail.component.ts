import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

interface ConceptData {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    tag: string;
    specs: { label: string; value: string }[];
    technicalDetails: string[];
}

@Component({
    selector: 'app-concept-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, SmartLogiLogoComponent],
    templateUrl: './concept-detail.component.html',
    styleUrl: './concept-detail.component.css'
})
export class ConceptDetailComponent implements OnInit {
    concept: ConceptData | undefined;

    private conceptsData: Record<string, ConceptData> = {
        'warehouse': {
            id: 'warehouse',
            title: 'Warehouse Neural Network',
            subtitle: 'REDEFINING ARCHIVAL LOGISTICS',
            description: 'Our AI-driven warehouse systems utilize a neural layer to optimize every cubic centimeter of storage. Robotic swarms coordinate in sub-millisecond synchronization to ensure zero-latency retrieval.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
            tag: 'AI OPTIMIZED',
            specs: [
                { label: 'EFFICIENCY', value: '+42%' },
                { label: 'RETRIEVAL', value: '1.2s' },
                { label: 'AUTONOMY', value: 'LEVEL 5' }
            ],
            technicalDetails: [
                'Dynamic storage allocation algorithms',
                'Robotic swarm synchronization (RSS)',
                'Predictive inventory management',
                'Next-gen thermal scanning'
            ]
        },
        'global-net': {
            id: 'global-net',
            title: 'Intercontinental Pipeline',
            subtitle: 'THE ARTERIES OF GLOBAL TRADE',
            description: 'A seamless integration of air, sea, and land modules. Our global network uses advanced trajectory planning to bypass bottlenecks before they happen.',
            image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
            tag: 'GLOBAL NET',
            specs: [
                { label: 'REACH', value: '214 COUNTRIES' },
                { label: 'ACCURACY', value: '99.8%' },
                { label: 'SPEED', value: 'MACH 0.8' }
            ],
            technicalDetails: [
                'Real-time trajectory optimization',
                'Automated customs clearance protocols',
                'Cross-modal synergy mapping',
                'Eco-efficient fuel management'
            ]
        },
        'tracking': {
            id: 'tracking',
            title: 'Live Telemetry Hub',
            subtitle: 'TOTAL VISIBILITY. ZERO DOUBT.',
            description: 'Sub-meter accuracy tracking for every shipment. Our telemetry hub provides a god-view of the entire supply chain, updated every 10 milliseconds.',
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
            tag: 'TELEMETRY',
            specs: [
                { label: 'LATENCY', value: '12ms' },
                { label: 'PRECISION', value: '0.5m' },
                { label: 'UPTIME', value: '100%' }
            ],
            technicalDetails: [
                'Multi-satellite signal triangulation',
                'IoT sensor mesh integration',
                'Blockchain-verified event logs',
                'Instant alert protocols'
            ]
        },
        'security': {
            id: 'security',
            title: 'Central Command Access',
            subtitle: 'RESTRICTED OPERATIONS PROTOCOL',
            description: 'The neural center of SmartLogi. This secure gateway manages global clearances, override codes, and personnel authentication. Access is strictly monitored.',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
            tag: 'SECURE OPS',
            specs: [
                { label: 'ENCRYPTION', value: 'AES-256' },
                { label: 'FIREWALL', value: 'ACTIVE' },
                { label: 'CLEARANCE', value: 'LVL 3+' }
            ],
            technicalDetails: [
                'Biometric handshake verification',
                'Quantum-resistant key exchange',
                'Real-time intrusion detection',
                'Audit trail immutability'
            ]
        },
        'fleet': {
            id: 'fleet',
            title: 'Autonomous Convoy Control',
            subtitle: 'THE FUTURE OF LAND TRANSIT',
            description: 'Our autonomous convoys adapt to environment conditions in real-time, maintaining perfect aerodynamic gaps to maximize efficiency and safety.',
            image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200',
            tag: 'FLEET OPS',
            specs: [
                { label: 'FUEL SAVINGS', value: '30%' },
                { label: 'SAFETY', value: '100%' },
                { label: 'FLEET SIZE', value: '5K+' }
            ],
            technicalDetails: [
                'Vehicle-to-Vehicle (V2V) communication',
                'Lidar-based obstacle avoidance',
                'Adaptive platooning algorithms',
                'Predictive maintenance scheduling'
            ]
        }
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            this.concept = this.conceptsData[id];
        });
    }
}
