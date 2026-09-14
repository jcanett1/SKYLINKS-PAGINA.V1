import React, { useState } from 'react';
import { X } from 'lucide-react';
import QuoteRequestForm from './QuoteRequestForm';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameraType: string;
}

interface CameraProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  features: string[];
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, cameraType }) => {
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<{name: string, type: string} | null>(null);

  if (!isOpen) return null;

  const getCamerasByType = (type: string): CameraProduct[] => {
    switch (type) {
      case 'ip':
        return [
          {
            id: 'ip-1',
            name: 'Dahua IPC-HDW1230S-S5',
            description: 'Cámara IP tipo domo de 2MP con visión nocturna',
            price: '$1,250.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/469224/camara-ip-bullet-2-megapixeles-microfono-integrado--IPC-HFW1230S1-A-S5-Dahua-2.png',
            features: [
              'Resolución 2MP (1080p)',
              'Lente fijo de 2.8mm',
              'IR hasta 30m',
              'IP67, PoE',
              'ángulo de visión de 102 grados'
            ]
          },
          {
            id: 'ip-2',
            name: 'Hikvision DS-2CD2143G2-I(S)',
            description: 'Cámara IP tipo domo de 4MP con IA integrada',
            price: '$2,450.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/DS2CD2143G2I(S)/DS2CD2143G2I(S)-l.PNG',
            features: [
              'Resolución 4MP',
              'Lente fijo de 2.8mm',
              'IR hasta 30m',
              'Detección de personas/vehículos',
              'IP67, IK10, PoE'
            ]
          },
          {
            id: 'ip-3',
            name: 'DAHUA DH-IPC-HFW1239S1-A-LED-S6',
            description: 'Camara IP Bullet 2 MP full color',
            price: '$950 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1532849/DAHUA-DHT0030194-CAMARA-BULLET-FULLCOLOR-2MP-CARRUCEL.png',
            features: [
              'Resolución 2MP',
              'Tecnologia full color',
              '2.8 mm',
              'IP67, PoE',
              '102° de apertura'
            ]
          },
          {
            id: 'ip-4',
            name: 'Hikvision DS-2CD1023G2-LIU',
            description: 'Cámara IP ColorVu de 4MP para color 24/7',
            price: '$1,458.51 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HIKVISION/DS2CD1023G2LIU/DS2CD1023G2LIU-l.PNG',
            features: [
              'Resolución 4MP',
              'Tecnología ColorVu (color 24/7)',
              'Lente fijo: 2.8 mm (ángulo de apertura 103°)',
              '30 m IR EXIR (visión nocturna)',
              'Compatible con plataforma Hik-Connect (P2P)',
              'IP67, PoE'
            ]
          },   
          {
            id: 'ip-5',
            name: 'DAHUA IPC-HDW1230T1-A-S5',
            description: 'Cámara IP Domo 2MP',
            price: '$969.97 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/481474/Dahua-Camara-IP-Domo-con-Microfono-Integrado-Lite-series-IPC-HDW1230T1-A-S5.png',
            features: [
              'Resolución 2MP',
              'Tecnología ColorVu (color 24/7)',
              'Lente fijo de 2.8mm',
              'ángulo de visión de 102 grados',
              'IR de 30m',
              'IP67, PoE'
            ]
          },
          {
            id: 'ip-6',
            name: 'HiLook Series IPC-B141H-C',
            description: 'Cámara IP Bala de 4 Megapixel ',
            price: '$984.84 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/HILOOKBYHIKVISION/IPCB141HC/IPCB141HC-l.PNG',
            features: [
              'Resolución 4MP',
              'Distancia infrarroja de 20 mts con Smart IR',
              'Distancia focal: 2.8 mm (ángulo de visión 104º )',
              'Compatible con Hik-Connect (P2P)',
              'IP67, PoE'
            ]
          }
        ];
      case 'wifi':
        return [
          {
            id: 'wifi-1',
            name: 'EZVIZ C6N',
            description: 'Cámara WiFi PTZ para interiores',
            price: '$750.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/C6N/C6N-p.PNG',
            features: [
              'Resolución 2MP (1080p)',
              'Pan/Tilt motorizado',
              'Visión nocturna hasta 10m',
              'Audio bidireccional',
              'Seguimiento inteligente'
            ]
          },
          {
            id: 'wifi-2',
            name: 'IMOU Ranger 2',
            description: 'Cámara WiFi PTZ con seguimiento inteligente',
            price: '$890.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1556699/IMOU-DHT0150050-CAMARA-RANGER-2-DOMO-3MP-MOTORIZADA-WIFI-PRINCIPAL.png',
            features: [
              'Resolución 2MP (1080p)',
              'Pan/Tilt motorizado',
              'Visión nocturna hasta 10m',
              'Seguimiento automático',
              'Sirena integrada'
            ]
          },
          {
            id: 'wifi-3',
            name: 'EZVIZ C3X',
            description: 'Cámara WiFi exterior con visión a color 24/7',
            price: '$2,477.72 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/C3X/C3X-p.PNG',
            features: [
              'Resolución 2MP (1080p)',
              'Visión a color 24/7',
              'Doble lente',
              'Detección de personas/vehículos',
              'IP67, WiFi'
            ]
          },
          {
            id: 'wifi-4',
            name: 'IMOU Bullet 2E',
            description: 'Cámara WiFi tipo bala para exteriores',
            price: '$1,250.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1460013/IMOU-DHT0150048-BULLET-2E-CAMARA-IP-WIFI-3MP-PRINCIPAL-TVC.png',
            features: [
              'Resolución 3MP',
              'Visión nocturna hasta 30m',
              'Detección de movimiento',
              'IP67, WiFi'
            ]
          },
          {
            id: 'wifi-5',
            name: 'Ezviz CS-H8C',
            description: 'Camara PT WiFi para exterior',
            price: '$1,150.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSH8C/CSH8C-AD-1-p.PNG',
            features: [
              'Resolución 2 MP (1920 x 1080)',
              'Lente 4mm',
              'Audio bidireccional con micrófono y bocina integrados',
              'IR hasta 30m',
              'Visión nocturna a color',
              'IP67, WiFi'
            ]
          },
          {
            id: 'wifi-6',
            name: 'IMOU Cruiser SC IPC-K7FN-5H0WE',
            description: 'Camara PT WiFi para exterior con seguimiento',
            price: '$1,350.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1675704/IMOU-IMO0150002-CAMARA-CUISER-SC-5MP-CARRUCEL.png',
            features: [
              'Resolución 5 MP',
              'Audio bidireccional con micrófono y bocina integrados',
              'IR hasta 30m',
              'Disuasión activa para seguridad avanzada',
              'Visión nocturna a color',
              'IP67, WiFi'
            ]
          }
        ];
      case 'solar':
        return [
          {
            id: 'solar-1',
            name: 'EZVIZ BC1C',
            description: 'Cámara recargable con batería de larga duración',
            price: '$2,976.16 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/BC1C/BC1C-p.PNG',
            features: [
              'Resolución 2MP (1080p)',
              'Batería recargable (hasta 210 días)',
              'Compatible con panel solar',
              'Visión Nocturna en color',
              'Alertas de voz personalizables',
              'Detección de personas',
              'Almacenamiento interno integrado de 32GB',
              'IP66, WiFi'
            ]
          },
          {
            id: 'solar-2',
            name: 'IMOU CELL PT LITE',
            description: 'Cámara recargable con panel solar incluido',
            price: '$2,450.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1331083/IMOU-DHT0150057-CELL-PT-LITE-KIT-PRINCIPAL-TVC.png',
            features: [
              'Resolución 3 Megapíxeles (2304 x 1296 píxeles)',
              'Panel solar incluido',
              'Batería de 13000mAh',
              'Sensor PIR: Integrado para detección precisa de movimiento',
              'Sensor PIR: Integrado para detección precisa de movimiento',
              'IP67, WiFi'
            ]
          },
          {
            id: 'solar-3',
            name: 'EZVIZ BC2',
            description: 'Cámara recargable con batería y panel solar opcional',
            price: '$1,950.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSBC2/CSBC2-AD-7-p.PNG',
            features: [
              'Resolución 2M',
              'Lente: 4 mm',
              'Micrófono y bocina interconstruida (audio de dos vías)',
              'Detección de movimiento',
              'Batería recargable (hasta 50 días maximo)',
              'Detección humana',
              'Visión a color 24/7',
              'IP66, WiFi'
            ]
          },
          {
            id: 'solar-4',
            name: 'IMOU CELL 3C Kit',
            description: 'Cámara recargable con batería de larga duración',
            price: '$1,950.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/1557954/IMOU-DHT0150056-CELL-3C-KIT-CAMARA-PANEL-PRINCIPAL.png',
            features: [
              'Resolución 32MP',
              'Visión nocturna: 15 m',
              'Panel solar integrado',
              'Detección humana PIR más eficiente',
              'IP65, WiFi'
            ]
          },
          {
            id: 'solar-5',
            name: ' EZVIZ CS-HB8',
            description: 'Camara PT / Wi-Fi / Con Bateria Recargable',
            price: '$3,850.00 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSHB8/CSHB8-l.PNG',
            features: [
              'Resolución 2K+ (2560x1440) ',
              'Cobertura panorámica 360°',
              'Micrófono y bocina interconstruida',
              'Visión nocturna: 15 m',
              'Almacenamiento interno eMMC de 32GB',
              'Detección humana y de vehiculos',
              'Compatible con Panel solar',
              'IP65, WiFi'
            ]
          }
        ];
      case 'doble lente':
        return [
          {
            id: 'doble-lente-1',
            name: 'EZVIZ CS-H9C/10MP',
            description: 'Cámara PT Doble Lente / 10 Megapixel',
            price: '$1,913.50 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/EZVIZ/CSH9C10MP/CSH9C10MP-l.PNG',
            features: [
              'Resolución 10MP 5M/5M',
              'Micrófono y bocina interconstruida (100 dB). (audio de dos vías)',
              'Visión nocturna a color',
              'Movimiento panoramico 340',
              'Detección de personas Y vehiculos',
              'IR 30m.',
              'IP66, WiFi'
            ]
          },
          {
            id: 'doble-lente-2',
            name: 'Epcom SCAM3DB',
            description: 'Camara doble lente 3mp',
            price: '$1,156.11 MXN',
            imageUrl: 'https://ftp3.syscom.mx/cdn-cgi/image/format=png,width=700,height=700/usuarios/fotos/BancoFotografiasSyscom/SMARTHOMEBYEPCOM/SCAM3DB/SCAM3DB-l.PNG',
            features: [
              'Resolución 3 Megapíxeless',
              'Audio bidireccional',
              'Soporta detección de movimiento',
              'Soporta autoseguimiento',
              'IP67, WiFi'
            ]
          },
          {
            id: 'doble-lente-3',
            name: 'DAHUA IPC-PDW5849-A180-E2-ASTE',
            description: 'Cámara IP Full Color doble lente',
            price: '$8,320.00 MXN',
            imageUrl: 'https://cdn.tvc.mx/media/935147/DAHUA-IPC-PDW5849-A180-E2-ASTE-C%C3%A1mara-IP-Full-Color-WizMind-imagen-principal.png',
            features: [
              'Resolución: 8 MP (4096 × 1800)',
              'Sensor de imagen',
              'Longitud focal: 3.6 mm',
              'Imagen a color 24/7',
              'Entrada y salda de alarma',
              'Entrada y salida de audio',
              'Audio bidireccional',
              'IP66, IP'
            ]
          }
        ];
      default:
        return [];
    }
  };

  const handleQuoteRequest = (camera: CameraProduct) => {
    setSelectedCamera({
      name: camera.name,
      type: cameraType
    });
    setQuoteFormOpen(true);
  };

  const cameras = getCamerasByType(cameraType);
  
  // Determinar el título según el tipo de cámara
  let typeTitle = '';
  switch(cameraType) {
    case 'ip':
      typeTitle = 'IP';
      break;
    case 'wifi':
      typeTitle = 'WiFi';
      break;
    case 'solar':
      typeTitle = 'Recargables';
      break;
    case 'doble lente':
      typeTitle = 'Doble Lente';
      break;
    default:
      typeTitle = cameraType;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-900">Catálogo de Cámaras {typeTitle}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cameras.map(camera => (
                <div key={camera.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                  <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                    <img 
                      src={camera.imageUrl} 
                      alt={camera.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{camera.name}</h4>
                    <p className="text-gray-600 mb-4">{camera.description}</p>
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Características:</h5>
                      <ul className="list-disc pl-5 text-gray-600">
                        {camera.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{camera.price}</span>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleQuoteRequest(camera)}
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
              Precios sujetos a cambio sin previo aviso. No incluye instalacion, Contacta a nuestro equipo para una cotización personalizada.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Request Form */}
      {selectedCamera && (
        <QuoteRequestForm 
          isOpen={quoteFormOpen} 
          onClose={() => setQuoteFormOpen(false)} 
          cameraInfo={selectedCamera}
        />
      )}
    </>
  );
};

export default CameraModal;