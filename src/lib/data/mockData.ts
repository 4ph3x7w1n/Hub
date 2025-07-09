export const kpiData = {
  mtta: {
    value: '4.2 min',
    trend: 'down' as const,
    trendValue: '12%',
    subtitle: 'Mean Time To Acknowledge'
  },
  mttr: {
    value: '18.7 min',
    trend: 'down' as const,
    trendValue: '8%',
    subtitle: 'Mean Time To Resolution'
  },
  incidentCount: {
    value: '247',
    trend: 'down' as const,
    trendValue: '15%',
    subtitle: 'Total Incidents This Month'
  },
  coverage: {
    value: '99.8%',
    trend: 'up' as const,
    trendValue: '0.2%',
    subtitle: 'Global Infrastructure Coverage'
  },
  uptime: {
    value: '99.97%',
    trend: 'stable' as const,
    trendValue: '0.0%',
    subtitle: 'System Uptime'
  }
};

export const chartData = {
  incidentTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Critical',
        data: [2, 1, 3, 2, 1, 2, 1, 2, 1, 1, 2, 1],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'High',
        data: [8, 6, 9, 7, 5, 8, 6, 7, 5, 6, 7, 5],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4
      },
      {
        label: 'Medium',
        data: [15, 12, 18, 14, 11, 16, 13, 14, 12, 13, 15, 12],
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4
      },
      {
        label: 'Low',
        data: [25, 20, 28, 22, 18, 24, 21, 23, 19, 20, 22, 18],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  },
  responseTime: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Average Response Time (minutes)',
        data: [3.2, 2.8, 4.5, 5.1, 4.8, 3.9],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      }
    ]
  },
  proactiveVsReactive: {
    labels: ['Proactive', 'Reactive'],
    datasets: [
      {
        data: [68, 32],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0
      }
    ]
  }
};

export const features = [
  {
    title: 'POS System Management',
    description: 'Point-of-sale infrastructure monitoring with real-time transaction health and payment processing oversight',
    icon: '🏪',
    variant: 'primary' as const,
    active: true
  },
  {
    title: 'Commerce Platform',
    description: 'E-commerce system reliability with order processing, inventory sync, and customer experience monitoring',
    icon: '🛒',
    variant: 'secondary' as const,
    active: true
  },
  {
    title: 'Connect Integration',
    description: 'API gateway and integration monitoring ensuring seamless connectivity between all platform components',
    icon: '🔗',
    variant: 'warning' as const,
    active: true
  },
  {
    title: 'Inventory Systems',
    description: 'Real-time inventory tracking with automated alerts for stock levels, sync failures, and warehouse operations',
    icon: '📦',
    variant: 'success' as const,
    active: true
  },
  {
    title: 'Coach Analytics',
    description: 'Performance coaching platform monitoring with user engagement metrics and training system health',
    icon: '📊',
    variant: 'primary' as const,
    active: true
  },
  {
    title: 'Portal Management',
    description: 'Customer and admin portal oversight with authentication, user experience, and access control monitoring',
    icon: '🏛️',
    variant: 'secondary' as const,
    active: true
  }
];

export const postmortemData = [
  {
    id: 'INC-2024-001',
    title: 'Payment Gateway Timeout Issues',
    date: '2024-01-15',
    severity: 'high' as const,
    impact: 'Payment processing delays affecting 15% of transactions across US East region',
    summary: 'Increased latency in payment gateway caused timeouts during peak shopping hours',
    resolution: 'Implemented circuit breaker pattern and increased connection pool size',
    rootCause: 'Database connection pool exhaustion under high load conditions',
    correctiveActions: [
      'Increase database connection pool from 50 to 100 connections',
      'Implement connection monitoring and alerting',
      'Add load balancing for payment processing services',
      'Create runbook for payment gateway incidents'
    ],
    duration: '2h 15m',
    affectedSystems: ['Payment Gateway', 'Order Processing', 'Customer Portal']
  },
  {
    id: 'INC-2024-002',
    title: 'API Rate Limiting Malfunction',
    date: '2024-01-08',
    severity: 'medium' as const,
    impact: 'API consumers experiencing 429 errors, affecting 3rd party integrations',
    summary: 'Rate limiting service incorrectly blocking legitimate API requests',
    resolution: 'Updated rate limiting algorithm and reset Redis cache',
    rootCause: 'Redis cache corruption due to improper key expiration handling',
    correctiveActions: [
      'Implement proper Redis key expiration logic',
      'Add monitoring for rate limiting accuracy',
      'Create automated cache health checks',
      'Establish rate limit bypass for critical partners'
    ],
    duration: '1h 30m',
    affectedSystems: ['API Gateway', 'Rate Limiting Service', 'Redis Cache']
  },
  {
    id: 'INC-2024-003',
    title: 'Authentication Service Degradation',
    date: '2024-01-12',
    severity: 'critical' as const,
    impact: 'Complete authentication failure affecting all user login attempts',
    summary: 'OAuth service became unresponsive due to certificate expiration',
    resolution: 'Renewed SSL certificates and restarted authentication services',
    rootCause: 'SSL certificate expired without proper renewal automation',
    correctiveActions: [
      'Implement automated certificate renewal',
      'Add certificate expiration monitoring',
      'Create backup authentication method',
      'Establish certificate lifecycle management'
    ],
    duration: '45m',
    affectedSystems: ['OAuth Service', 'User Authentication', 'SSO Portal']
  }
];

export const capabilities = [
  {
    title: 'Proactive Monitoring',
    description: 'Advanced observability with predictive analytics to identify issues before they impact users',
    icon: '📊'
  },
  {
    title: 'Incident Ownership',
    description: 'End-to-end incident management from detection to resolution and postmortem',
    icon: '🎯'
  },
  {
    title: 'Global Coverage',
    description: '24/7 support across all time zones with regional expertise',
    icon: '🌐'
  },
  {
    title: 'Automated Response',
    description: 'Intelligent automation for common incidents and escalation workflows',
    icon: '🤖'
  }
];

export const teamStats = {
  size: 'Medium',
  coverage: '24/7',
  regions: ['US East', 'US West', 'Europe', 'Asia Pacific'],
  specialties: ['Infrastructure', 'Applications', 'Security', 'Performance']
};