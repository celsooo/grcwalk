import React from 'react';
import { 
  LayoutDashboard, 
  List, 
  Grid, 
  Shield, 
  GitCompare,
  Menu,
  X,
  ScrollText,
  ClipboardList,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'risks', name: 'Risk Catalog', icon: <List className="w-5 h-5" /> },
    { id: 'heatmap', name: 'Risk Heatmap', icon: <Grid className="w-5 h-5" /> },
    { id: 'controls', name: 'Controls', icon: <Shield className="w-5 h-5" /> },
    { id: 'bowtie', name: 'Bow-Tie Analysis', icon: <GitCompare className="w-5 h-5" /> },
    { id: 'compliance', name: 'Compliance', icon: <ScrollText className="w-5 h-5" /> },
    { id: 'actions', name: 'Action Plans', icon: <ClipboardList className="w-5 h-5" /> },
    { id: 'audits', name: 'Audit Planning', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? 
            <X className="h-6 w-6" /> : 
            <Menu className="h-6 w-6" />
          }
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <nav className="h-full pt-5 pb-4 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activePage === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 flex flex-col h-screen border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activePage === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => onPageChange(item.id)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;