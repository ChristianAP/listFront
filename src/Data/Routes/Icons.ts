import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';
import { FaGifts } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { BiSupport } from 'react-icons/bi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { BsShop } from 'react-icons/bs';
import { MdPointOfSale } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';

export const MyIcons = (iconName: string) => {
    const iconsList = {
        'Ventas': GiReceiveMoney,
        'Producto': FaGifts,
        'Compra': GiPayMoney,
        'Configuración': IoMdSettings,
        'Soporte': BiSupport,
        'Inicio': AiOutlineDashboard,
        'Venta en Feria':BsShop,
        'Tienda Online':MdPointOfSale,
        'Insumo':FiTruck,
    }
    //@ts-ignore
    return iconsList[iconName]
}