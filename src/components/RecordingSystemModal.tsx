import React, { useState } from 'react';
import { X } from 'lucide-react';
import QuoteRequestForm from './QuoteRequestForm';

interface RecordingSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemType: string;
}

interface RecordingSystem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  features: string[];
}

const RecordingSystemModal: React.FC<RecordingSystemModalProps> = ({ isOpen, onClose, systemType }) => {
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<{name: string, type: string} | null>(null);

  if (!isOpen) return null;

  const getSystemsByType = (type: string): RecordingSystem[] => {
    switch (type) {
      case 'nvr':
        return [
          {
            id: 'nvr-1',
            name: 'Hikvision DS-7616NI-Q2/16P',
            description: 'NVR de 16 canales con 16 puertos PoE integrados',
            price: '$7,850.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/DS7616NIQ2_16P(D)/DS7616NIQ2_16P(D)-p.PNG',
            features: [
              'Grabación de hasta 16 cámaras IP',
              'Resolución de grabación hasta 8MP (4K)',
              '16 puertos PoE integrados',
              'Ancho de banda de entrada 160 Mbps',
              'Soporta 2 discos duros SATA de hasta 10TB cada uno',
              'HDMI y VGA hasta 4K (3840 × 2160)',
              'Compatible con Hik-Connect P2P'
            ]
          },
          {
            id: 'nvr-2',
            name: 'Dahua NVR4216-16P-4KS2',
            description: 'NVR de 16 canales con 16 puertos PoE y tecnología AI',
            price: '$6,950.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/209132/NVR-16-canales-IP-4k-Dahua-NVR4216-16P-4KS2.png',
            features: [
              'Grabación de hasta 16 cámaras IP',
              'Resolución de grabación hasta 8MP (4K)',
              '16 puertos PoE integrados',
              'Ancho de banda de entrada 200 Mbps',
              'Soporta 2 discos duros SATA de hasta 12TB cada uno',
              'HDMI y VGA hasta 4K',
              'Funciones de IA: detección facial, perimetral'
            ]
          },
          {
            id: 'nvr-3',
            name: 'Hikvision DS-7608NXI-K2/8P',
            description: 'NVR 12 Megapixel (4K) / 8 canales IP / 8 Puertos PoE+ / AcuSense ',
            price: '$4,950.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/DS7608NXIK2_8P/DS7608NXIK2_8P-l.PNG',
            features: [
              'Grabación de hasta 8 cámaras IP',
              'Resolución de grabación hasta 12MP (4K)',
              '8 puertos PoE integrados',
              'Ancho de banda de entrada 80 Mbps',
              'Soporta 2 discos duros SATA de hasta 10TB cada uno',
              'HDMI y VGA hasta 4K',
              'Compatible con Hik-Connect P2P'
            ]
          },
          {
            id: 'nvr-4',
            name: 'DAHUA NVR2104HS-P-I2 - NVR',
            description: 'NVR DE 8 Megapixeles/ 4k/ 4 Canales IP/ WizSense/ 4 Puertos Poe',
            price: '$2,650.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/703352/DHT0180004.png',
            features: [
              'Grabación de hasta 4 cámaras IP',
              'Decodificación inteligente',
              '4 puertos PoE integrados',
              'Rendimiento de 80 Mbps',
              'Capacidad: Hasta 6 canales en 1080p a 30 fps',
              'Soporta 1 disco duro de hasta 10TB',
              'IA por NVR: Reconocimiento facial y protección perimetral',
              'Compatible con DMSS/P2P'
            ]
          },
          {
            id: 'nvr-5',
            name: 'HiLook NVR-104H-D/4P(D)',
            description: 'NVR 4 Megapixel (Compatibles con Cámaras AcuSense)',
            price: '$1,747.01 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HILOOKBYHIKVISION/NVR104HD_4P(D)/NVR104HD_4P(D)-l.PNG',
            features: [
              '4 Megapixel',
              '4 Puertos PoE',
              'Soporta 1 HDD de hasta 6 TB',
              'Procesamiento de entrada: 40 Mbps.',
              'Compatible con Hik-Connect P2P',
              'Ideal para proyectos medianos y grandes'
            ]
          },
           {
            id: 'nvr-6',
            name: 'DAHUA NVR1104HS-P-S3/H',
            description: 'NVR de 8 Megapixeles/ 4k/ 4 Canales IP/ 4 puertos PoE',
            price: '$1,947.01 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/209045/NVR-4-canales-IP-POE-Dahua-DHI-NVR1104HS-P-S3H.png',
            features: [
              '8 Megapixel',
              '4 Puertos PoE',
              'Soporta 1 HDD de hasta 8 TB',
              'Rendimiento de 80 mbps.',
              'Compatible con Hik-Connect P2P',
              'Ideal para proyectos medianos y grandes',
              'Tecnologia IP'
            ]
          }
        ];
      case 'dvr':
        return [
          {
            id: 'dvr-1',
            name: 'Hikvision IDS-7216HQHI-M1/XT',
            description: 'DVR 16 Canales TURBOHD + 8 Canales IP',
            price: '$3,950.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/IDS7216HQHIM1_XT/IDS7216HQHIM1_XT-l.PNG',
            features: [
              'Grabación de hasta 16 cámaras HDTVI/AHD/CVI/CVBS',
              '5 Megapixel Lite - 3K Lite',
              'Audio de dos vias',
              'Soporta reconocimiento facial',
              'Soporta 1 HDD de hasta 10 TB',
              'Compatible con Hik-Connect P2P'
            ]
          },
          {
            id: 'dvr-2',
            name: 'Dahua DAHUA XVR1B04-I',
            description: 'DVR de 4 Canales 1080p LiteWizSense y Cooper-I',
            price: '$650.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/255519/Grabador-de-seguridad-dahua-DH-XVR1B04-I.png',
            features: [
              'Compresión de video de doble flujo H.265 + / H.265',
              'Admite codificación AI de canal completo',
              'Admite entradas de video HDCVI / AHD / TVI / CVBS / IP',
              'Entradas de cámara IP de 5 canales como máximo, cada canal hasta 2MP',
              ' Ancho de banda entrante máximo de 20 Mbps',
              'Búsqueda inteligente de personas y vehículos'
            ]
          },
          {
            id: 'dvr-3',
            name: 'Hikvision DS-7204HUHI-K1',
            description: 'DVR Turbo HD de 4 canales',
            price: '$4,200.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/DS7204HUHIK1/DS7204HUHIK1-l.PNG',
            features: [
              'Grabación de hasta 4 cámaras HDTVI/AHD/CVI/CVBS',
              'Resolución de grabación hasta 8MP (4K)',
              '4 Entradas de alarma ',
              'Soporta 1 disco duro SATA de hasta 10TB',
              'HDMI y VGA hasta 4K',
              'Compatible con Hik-Connect P2P'
            ]
          },
          {
            id: 'dvr-4',
            name: 'Dahua XVR1B04H-I-SSD',
            description: 'DVR de 4 Canales 5 Megapixeles Lite',
            price: '$1,599.49 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1121737/Grabador-de-seguridad-dahua--S-XVR--XVR1B04H-I-con-Disco-duro-de-512-GB.png',
            features: [
              'Resolucion de 5 MP',
              'Amite codificación AI de canal completo',
              'Viene con un SSD interno de 512 GB',
              'Admite entradas de vídeo HDCVI/AHD/TVI/CVBS/IP.',
              'SMD Plus',
              'Solución económica para sistemas básicos'
            ]
          },
          {
            id: 'dvr-5-hikvision',
            name: 'Hikvision DS-7108HGHI-M1(C)',
            description: 'DVR 2 Megapixel (1080P) lite / 8 Canales TURBOHD',
            price: '$1,150.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/IDS7216HQHIM1_S/IDS7216HQHIM1_S-l.PNG',
            features: [
              'Cuenta con audio por coaxitron',
              'Resolución de grabación hasta 2MP',
              'Soporta busqueda inteligente por humanos / vehiculos',
              'Soporta 1 disco duro SATA de hasta 10TB',
              'HDMI y VGA hasta 1080p',
              'Compatible con Hik-Connect P2P'
            ]
          },
          {
            id: 'dvr-6',
            name: 'DAHUA XVR1B08H-I',
            description: 'DVR de 8 canales 5MP Lite con WizSense y H.265+',
            price: '$1,576.85 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/255615/Grabador-de-seguridad-dahua-XVR1B08H-I.png',
            features: [
              'Codificación AI de canal completo',
              'Resolución de grabación hasta 5MP',
              'Soporta busqueda inteligente por humanos / vehiculos',
              'Compresión H.265+ / H.265',
              'SMD Plus'
            ]
          }
        ];
      default:
        return [];
    }
  };

  const handleQuoteRequest = (system: RecordingSystem) => {
    setSelectedSystem({
      name: system.name,
      type: systemType
    });
    setQuoteFormOpen(true);
  };

  const systems = getSystemsByType(systemType);
  
  // Determinar el título según el tipo de sistema
  let typeTitle = '';
  switch(systemType) {
    case 'nvr':
      typeTitle = 'NVR (Network Video Recorder)';
      break;
    case 'dvr':
      typeTitle = 'DVR (Digital Video Recorder)';
      break;
    default:
      typeTitle = systemType;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-900">Catálogo de Sistemas {typeTitle}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {systems.map(system => (
                <div key={system.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                  <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                    <img 
                      src={system.imageUrl} 
                      alt={system.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{system.name}</h4>
                    <p className="text-gray-600 mb-4">{system.description}</p>
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Características:</h5>
                      <ul className="list-disc pl-5 text-gray-600">
                        {system.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{system.price}</span>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleQuoteRequest(system)}
                    >
                      Solicitar Cotización
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t bg-gray-50">
            <p className="text-gray-600 text-center">
              Precios sujetos a cambio sin previo aviso. No incluye disco duro ni instalación. Contacta a nuestro equipo para una cotización personalizada.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Request Form */}
      {selectedSystem && (
        <QuoteRequestForm 
          isOpen={quoteFormOpen} 
          onClose={() => setQuoteFormOpen(false)} 
          cameraInfo={selectedSystem}
        />
      )}
    </>
  );
};

export default RecordingSystemModal;