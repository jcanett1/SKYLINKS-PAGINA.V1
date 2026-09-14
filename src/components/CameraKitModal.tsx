import React, { useState } from 'react';
import { X } from 'lucide-react';
import QuoteRequestForm from './QuoteRequestForm';

interface CameraKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CameraKit {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  features: string[];
  includes: string[];
}

const CameraKitModal: React.FC<CameraKitModalProps> = ({ isOpen, onClose }) => {
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<{name: string, type: string} | null>(null);

  if (!isOpen) return null;

  const cameraKits: CameraKit[] = [
    {
      id: 'kit-1',
      name: 'Kit Hikvision COLORVU TURBOHD 1080pLite',
      description: 'DVR 4 Canales / 4 Cámaras Eyeball (exterior)',
      price: '$3,831.25 MXN',
      imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/KH1080PL4EC/KH1080PL4EC-l.PNG',
      features: [
        'Grabación en resolución 1080p (2MP)',
        'DVR pentahibrido: HD-TVI / HD-CVI / Analogico / IP / AHD',
        'Soporta audio en todos sus canales por coaxitron.',
        'Visualización remota por Hik-Connect'
      ],
      includes: [
        '1 DVR Hikvision DS-7104HGHI-K1(S) de 4 canales',
        'Cámara Eyeball 1080p uso en exterior Hikvision DS-2CE70DF0T-MF de 2MP',
        '4 Kit de transceptores pasivos TURBOHD',
        '1 Fuente de poder para 4 cámaras DS-2FA1225-C4/K',
        '4 Adaptador Macho Tipo Jack de 3.5 mm Polarizado de 12 Vcc'
      ]
    },
    {
      id: 'kit-2',
      name: 'Kit DAHUA KITXVR1B08-I-2MP4CP',
      description: 'Kit de videovigilancia de 8 canales. Incluye 4 cámaras',
      price: '$2,646.68 MXN',
      imageUrl: 'https://cdn.tvc.mx/media/330989/Kit-de-videovigilancia-completo-marca-Dahua-KITXVR1B08-I-2MP4CP.png',
      features: [
        'Grabación en resolución 1080p (2MP)',
        'Iluminación IR  visión nocturna optimizada, hasta 20 metros',
        'Penta-híbrido que soporta 5 tecnologías diferentes: HDCVI /AHD/TVI/CVBS/IP',
        'búsqueda de humanos y vehículos',
        'Acceso remoto vía smartphone'
      ],
      includes: [
        '1 Grabador XVR1B08-I de 8 canales',
        '4 Cámaras Bullet B1A21N de 2MP',
        '4 rollos de cable siamés de 18mts',
        '1 Fuente de poder',
        '1 Pulpo para 4 cámaras'
      ]
    },
    {
      id: 'kit-3',
      name: 'Kit Hikvision 4 Cámaras IP 4MP PoE',
      description: 'Kit completo de videovigilancia IP con 4 cámaras y NVR PoE',
      price: '$9,802.75 MXN',
      imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/KIT4MP_4B_1TB/KIT4MP_4B_1TB-l.PNG',
      features: [
        'Resolución Máxima: 2 Megapixel',
        'Visión nocturna hasta 30 metros',
        'Detección inteligente',
        'Acceso remoto vía smartphone',
        '4 Puertos PoE+ (soporta estándar af / at)'
      ],
      includes: [
        '1 NVR Hikvision DS-7104NI-Q1/4P(C) de 4 canales con 4 puertos PoE',
        '4 Cámaras bullet IP HikvisionDS-2CD1047G2-LIUF de 2MP',
        '1 Disco duro de 1TB preinstalado V300X/1TB',
        '1 Bobina de red de 100 metros'
      ]
    },
    {
      id: 'kit-4',
      name: 'Kit Dahua 4 Cámaras IP 4MP PoE',
      description: 'Kit completo de videovigilancia IP con 4 cámaras y NVR PoE',
      price: '$5,200.00 MXN',
      imageUrl: 'https://cdn.tvc.mx/media/1684724/DAHUA-DHT3300005-KIT-PRINCIPAL.png',
      features: [
        'Grabación en resolución 2MP',
        'Frecuencia de Imagen: Hasta 30 cuadros por segundo (fps) para una reproducción de video fluida',
        'Visión Nocturna: LED infrarrojo con alcance de hasta 30 metros',
        'Acceso remoto vía smartphone',
        'Protección: IP67'
      ],
      includes: [
        '1 NVR Dahua NVR1104HS-P-S3/H de 4 canales con 4 puertos PoE',
        '4 Cámaras bullet IP Dahua IPC-B1E20 de 2MP',
        '1 Disco duro de 1TB ',
        'Bobina de 100m'
      ]
    },
    {
      id: 'kit-5',
      name: 'Kit de Camaras WiFi, Incluye 8 Piezas CS-H8C y 8 Piezas HS-TF-E1/32G',
      description: 'Kit de Camaras WiFi, Incluye 8 Piezas',
      price: '$8,078.56 MXN',
      imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSH8C_KM8/CSH8C_KM8-l.PNG',
      features: [
        'Resolución 2 MP (1920 x 1080) para claridad superior',
        'Visión nocturna hasta 30 metros',
        'Micrófono y bocina interconstruida (audio de dos vías).',
        'Tarjetas micro SD 32GB',
        'Instalación inalámbrica WiFi',
        'Configuración únicamente mediante aplicación EZVIZ.'
      ],
      includes: [
        '8 Cámaras modelo CS-H8C',
        '8 Memorias microSD HS-TF-E1/32GP'
      ]
    },
    {
      id: 'kit-6',
      name: 'Kit de Camaras WiFi, Incluye 2 Piezas CS-H8C y 2 Piezas HS-TF-E1/32G',
      description: 'Kit de Camaras WiFi, incluye 2 piezas',
      price: '$2,200.00 MXN',
      imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSH8C_KM2/CSH8C_KM2-l.PNG',
      features: [
        'Grabación en resolución 2MP',
        'Visión nocturna a color',
        'Detección inteligente de personas',
        'Audio bidireccional',
        'Instalación inalámbrica WiFi',
        'Cámaras CS-H8c compatibles con Google Home'
      ],
      includes: [
        'Kit 2 Piezas CS-H8C',
        'Incluye 2 memorias microSD de 32GB'
      ]
    }
  ];

  const handleQuoteRequest = (kit: CameraKit) => {
    setSelectedKit({
      name: kit.name,
      type: 'kit'
    });
    setQuoteFormOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-900">Kits Completos de Videovigilancia</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cameraKits.map(kit => (
                <div key={kit.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                  <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                    <img 
                      src={kit.imageUrl} 
                      alt={kit.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{kit.name}</h4>
                    <p className="text-gray-600 mb-4">{kit.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Características:</h5>
                      <ul className="list-disc pl-5 text-gray-600">
                        {kit.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-800 mb-2">El kit incluye:</h5>
                      <ul className="list-disc pl-5 text-gray-600">
                        {kit.includes.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{kit.price}</span>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleQuoteRequest(kit)}
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
              Precios sujetos a cambio sin previo aviso. No incluye instalación. Contacta a nuestro equipo para una cotización personalizada.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Request Form */}
      {selectedKit && (
        <QuoteRequestForm 
          isOpen={quoteFormOpen} 
          onClose={() => setQuoteFormOpen(false)} 
          cameraInfo={selectedKit}
        />
      )}
    </>
  );
};

export default CameraKitModal;