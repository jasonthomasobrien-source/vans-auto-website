document.addEventListener('DOMContentLoaded', () => {
  const startTourBtn = document.getElementById('btn-start-tour');

  if (startTourBtn) {
    startTourBtn.addEventListener('click', startTour);
  }
});

function startTour() {
  const driver = window.driver.js.driver;

  const tour = driver({
    allowClose: true,
    animate: true,
    overlayOpacity: 0.5,
    steps: [
      {
        element: '#kpi-grid',
        popover: {
          title: 'Welcome to Van\'s Auto Dashboard',
          description: 'Here\'s a quick tour of your dashboard. Let\'s start with your key metrics at the top.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#kpi-revenue',
        popover: {
          title: 'Revenue This Month',
          description: 'Track your monthly revenue at a glance. This updates based on completed work orders.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#kpi-orders',
        popover: {
          title: 'Open Work Orders',
          description: 'See how many work orders are currently in progress. Click to manage them.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#card-revenue-chart',
        popover: {
          title: 'Revenue Analytics',
          description: 'View your revenue trend over the last 6 months. Click to see detailed analytics.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#card-schedule',
        popover: {
          title: 'Today\'s Schedule',
          description: 'Keep track of today\'s appointments and service work. Schedule is updated in real-time.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#card-inventory',
        popover: {
          title: 'Inventory Alerts',
          description: 'Monitor parts inventory and get alerted when stock runs low. Click to manage inventory.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#card-customers',
        popover: {
          title: 'Customer Database',
          description: 'Manage all your customers, their service history, and lifetime value. Click to view all.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#card-workorders',
        popover: {
          title: 'Work Orders',
          description: 'Create, track, and manage all work orders. Assign jobs to technicians and monitor progress.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '#btn-connect-pos',
        popover: {
          title: 'POS Integration',
          description: 'Connect your point-of-sale system to auto-sync sales, invoices, and customer data.',
          side: 'bottom',
          align: 'end'
        }
      },
      {
        element: '.header-subtitle',
        popover: {
          title: 'Tour Complete!',
          description: 'You\'re all set. Navigate using the menu to explore each section in detail. Happy managing!',
          side: 'bottom',
          align: 'start'
        }
      }
    ]
  });

  // Reset scroll before starting tour
  const pageBody = document.querySelector('.page-body');
  if (pageBody) pageBody.scrollTop = 0;

  tour.drive();
}
