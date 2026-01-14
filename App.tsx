import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Bluetooth, 
  BluetoothOff, 
  Battery, 
  BatteryWarning, 
  Trash2, 
  ScanLine, 
  Wifi, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  Loader2,
  Plus
} from 'lucide-react';

// --- Types ---

enum ViewState {
  LIST = 'LIST',
  SEARCHING = 'SEARCHING',
  SEARCH_FAILED = 'SEARCH_FAILED',
  FOUND = 'FOUND',
  CONNECTING = 'CONNECTING',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  SUCCESS = 'SUCCESS'
}

interface Device {
  id: string;
  name: string;
  serial: string;
  firmware: string;
  batteryLevel: number; // 0-100
  isConnected: boolean;
  isBindingFailed?: boolean;
}

// --- Mock Data ---

const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'Memoket NotePins',
    serial: '84748595976',
    firmware: '0207',
    batteryLevel: 80,
    isConnected: true,
  },
  {
    id: '2',
    name: 'Memoket NotePins',
    serial: '84748595976',
    firmware: '0207',
    batteryLevel: 15,
    isConnected: true,
  },
  {
    id: '3',
    name: 'Memoket NotePins',
    serial: '84748595976',
    firmware: '0207',
    batteryLevel: 0,
    isConnected: false,
  },
];

// --- Components ---

// 1. Reusable Device Icon (The black rounded rectangle in the screenshot)
const DeviceThumbnail = () => (
  <div className="w-12 h-20 bg-neutral-900 rounded-xl shadow-md flex items-center justify-center relative overflow-hidden">
    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-neutral-800 to-black opacity-50"></div>
    {/* Subtle highlight to mimic plastic */}
    <div className="absolute top-2 left-2 w-1 h-6 bg-white/10 rounded-full blur-[1px]"></div>
  </div>
);

// 2. Card Component matching the design
interface DeviceCardProps {
  device: Device;
  onLink?: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onLink }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="text-neutral-900 font-bold text-lg mb-2">{device.name}</h3>
          
          <div className="space-y-1 mb-4">
            <div className="inline-flex bg-gray-100/80 px-2 py-0.5 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">
              Serial number: {device.serial}
            </div>
            <br />
            <div className="inline-flex bg-gray-100/80 px-2 py-0.5 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">
              Firmware version: {device.firmware}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-400">
            {device.isConnected ? (
              <Bluetooth className="w-4 h-4 text-blue-500" />
            ) : (
              <BluetoothOff className="w-4 h-4" />
            )}
            
            {device.isConnected && (
              device.batteryLevel > 20 ? (
                <Battery className="w-4 h-4 text-neutral-800" />
              ) : (
                <BatteryWarning className="w-4 h-4 text-red-500" />
              )
            )}
          </div>

          {device.isBindingFailed && (
            <div className="mt-3 flex items-center text-red-500 text-xs font-medium">
              <span className="w-4 h-4 border border-red-500 rounded-full flex items-center justify-center mr-1.5 text-[10px]">!</span>
              Binding failed
            </div>
          )}
        </div>

        {/* Right Side: Device Image or Link Button */}
        <div className="flex flex-col items-center justify-between h-full space-y-4">
           <DeviceThumbnail />
           
           {device.isBindingFailed && onLink && (
             <button 
               onClick={onLink}
               className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-2 rounded-full shadow-lg shadow-purple-200 transition-transform active:scale-95"
             >
               Link
             </button>
           )}
        </div>
      </div>
      
      {/* Swipe Action Mock (Red Delete Background) - Visual only for demo */}
      {device.isBindingFailed && (
        <div className="absolute top-4 right-[-60px] h-[80%] w-16 bg-red-100 rounded-l-xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 cursor-pointer">
          <Trash2 size={20} />
        </div>
      )}
    </div>
  );
};

// 3. Add Device Button (Dashed)
const AddDeviceButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer group mb-8"
  >
    <div className="w-12 h-12 mb-3 relative flex items-center justify-center">
       {/* Custom Cross Icon similar to design */}
       <div className="absolute w-8 h-0.5 bg-gray-800 rounded-full group-hover:scale-110 transition-transform"></div>
       <div className="absolute h-8 w-0.5 bg-gray-800 rounded-full group-hover:scale-110 transition-transform"></div>
       
       {/* Dotted corners effect */}
       <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-300 rounded-tl-lg"></div>
       <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-300 rounded-tr-lg"></div>
       <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-300 rounded-bl-lg"></div>
       <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-300 rounded-br-lg"></div>
    </div>
    <span className="font-medium text-neutral-900">Add device</span>
  </button>
);


// --- Main App Logic ---

export default function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  
  // Simulation Logic
  useEffect(() => {
    // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid missing namespace error
    let timeout: ReturnType<typeof setTimeout>;

    if (viewState === ViewState.SEARCHING) {
      // Simulate search delay
      timeout = setTimeout(() => {
        // Randomly decide if we found something or failed for demo purposes
        const randomOutcome = Math.random() > 0.3 ? ViewState.FOUND : ViewState.SEARCH_FAILED;
        setViewState(randomOutcome);
      }, 3000);
    }

    if (viewState === ViewState.CONNECTING) {
      // Simulate connection delay
      timeout = setTimeout(() => {
        // Randomly success or fail
        const randomOutcome = Math.random() > 0.3 ? ViewState.SUCCESS : ViewState.CONNECTION_FAILED;
        setViewState(randomOutcome);
      }, 2500);
    }
    
    if (viewState === ViewState.SUCCESS) {
      // Auto return to list after success
       timeout = setTimeout(() => {
        const newDevice: Device = {
          id: Date.now().toString(),
          name: 'Memoket NotePins',
          serial: '84748595976',
          firmware: '0207',
          batteryLevel: 100,
          isConnected: true
        };
        setDevices(prev => [...prev, newDevice]);
        setViewState(ViewState.LIST);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [viewState]);


  // Helper for Header
  const Header = ({ title, onBack }: { title: string, onBack?: () => void }) => (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-[#f8f9fc]">
      <button 
        onClick={onBack} 
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
        {title}
      </h1>
      <div className="w-10"></div> {/* Spacer for alignment */}
    </div>
  );

  // --- Views ---

  const renderListView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <Header title="My equipment" />
      
      <div className="flex-1 px-5 pt-2 pb-10">
        {devices.map(device => (
          <DeviceCard 
            key={device.id} 
            device={device} 
            onLink={() => {/* Handle rebinding */}}
          />
        ))}

        {/* Mocking a failed state card to match the design explicitly */}
        <DeviceCard 
            device={{
                id: 'failed-mock',
                name: 'Memoket NotePins',
                serial: '84748595976',
                firmware: '0207',
                batteryLevel: 0,
                isConnected: false,
                isBindingFailed: true
            }}
            onLink={() => console.log('Link clicked')}
        />

        <AddDeviceButton onClick={() => setViewState(ViewState.SEARCHING)} />
      </div>
    </div>
  );

  const renderSearchingView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col relative overflow-hidden">
      <Header title="Add Device" onBack={() => setViewState(ViewState.LIST)} />
      
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        {/* Radar Animation */}
        <div className="relative flex items-center justify-center">
            <div className="absolute w-64 h-64 border border-purple-200 rounded-full animate-ping opacity-20 delay-1000"></div>
            <div className="absolute w-48 h-48 border border-purple-300 rounded-full animate-ping opacity-40 delay-500"></div>
            <div className="absolute w-32 h-32 bg-purple-100 rounded-full animate-pulse opacity-50"></div>
            
            <div className="z-10 bg-white p-6 rounded-full shadow-xl shadow-purple-100">
               <ScanLine className="w-12 h-12 text-[#7C3AED] animate-pulse" />
            </div>
        </div>
        
        <h2 className="mt-12 text-xl font-bold text-gray-900">Searching...</h2>
        <p className="mt-2 text-gray-500 text-sm text-center px-10">
          Place your phone close to the device.<br/>Ensure Bluetooth is turned on.
        </p>
      </div>
    </div>
  );

  const renderSearchFailedView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <Header title="Add Device" onBack={() => setViewState(ViewState.LIST)} />
      
      <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">No devices found</h2>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-xs">
          Make sure your device is powered on, in pairing mode, and near your phone.
        </p>

        <button 
          onClick={() => setViewState(ViewState.SEARCHING)}
          className="w-full max-w-xs bg-white border border-gray-200 text-gray-900 font-semibold py-4 rounded-full shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );

  const renderFoundView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <Header title="Device Found" onBack={() => setViewState(ViewState.SEARCHING)} />
      
      <div className="flex-1 px-5 pt-10 flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center mb-8 animate-fade-in-up">
            <DeviceThumbnail />
            <h3 className="mt-6 text-xl font-bold text-gray-900">Memoket NotePins</h3>
            <p className="text-sm text-gray-400 mt-1">S/N: 84748595976</p>
            
            <div className="mt-8 w-full">
                <button 
                    onClick={() => setViewState(ViewState.CONNECTING)}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-full shadow-lg shadow-purple-200 transition-all active:scale-95"
                >
                    Connect
                </button>
            </div>
        </div>
        <p className="text-xs text-gray-400 text-center">Is this not your device? <span className="text-[#7C3AED] font-semibold cursor-pointer" onClick={() => setViewState(ViewState.SEARCHING)}>Scan again</span></p>
      </div>
    </div>
  );

  const renderConnectingView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
       <Header title="Connecting" />
       
       <div className="flex-1 flex flex-col items-center justify-center pb-20">
         <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#7C3AED] rounded-full border-t-transparent animate-spin"></div>
            <Bluetooth className="w-8 h-8 text-[#7C3AED]" />
         </div>
         
         <h2 className="mt-8 text-xl font-bold text-gray-900">Connecting...</h2>
         <p className="mt-2 text-gray-500 text-sm">Do not turn off Bluetooth</p>
       </div>
    </div>
  );

  const renderConnectionFailedView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <Header title="Connection Failed" onBack={() => setViewState(ViewState.FOUND)} />
      
      <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Smartphone className="w-10 h-10 text-red-500 opacity-50" />
          <XCircle className="w-6 h-6 text-red-600 absolute bottom-6 right-6 bg-white rounded-full border-2 border-white" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Failed</h2>
        <p className="text-gray-500 text-sm text-center mb-10 max-w-xs">
          Something went wrong during the pairing process. Please try again.
        </p>

        <button 
          onClick={() => setViewState(ViewState.CONNECTING)}
          className="w-full max-w-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-full shadow-lg shadow-purple-200 transition-all"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  const renderSuccessView = () => (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
       <div className="flex-1 flex flex-col items-center justify-center pb-10">
         <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 animate-bounce">
           <CheckCircle2 className="w-14 h-14 text-green-500" />
         </div>
         
         <h2 className="text-2xl font-bold text-gray-900">Connected!</h2>
         <p className="mt-2 text-gray-500 text-sm">Your device is ready to use.</p>
       </div>
    </div>
  );

  // --- Render Router ---

  switch (viewState) {
    case ViewState.SEARCHING:
      return renderSearchingView();
    case ViewState.SEARCH_FAILED:
      return renderSearchFailedView();
    case ViewState.FOUND:
      return renderFoundView();
    case ViewState.CONNECTING:
      return renderConnectingView();
    case ViewState.CONNECTION_FAILED:
      return renderConnectionFailedView();
    case ViewState.SUCCESS:
      return renderSuccessView();
    case ViewState.LIST:
    default:
      return renderListView();
  }
}