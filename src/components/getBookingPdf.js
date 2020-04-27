import jsPdf from 'jspdf';
import dealerHeader from '../constants/dealerHeader.js';
import Bookinglist from './bookinglist.jsx';

const getBookingPdf = (booking,dealer,machine) => {
    console.log('booking : ',booking);
    console.log('machine : ',machine);

    const typeOfBooking = booking.status === 'contract' ? 'Contrat' : 'Devis';
    const unitChoice = booking.unitChoice ==='day' ? 'jour(s)' : booking.unitChoice
    const firstBookingDate = booking.firstBookingDate.format('DD MMMM YYYY');
    const lastBookingDate = booking.lastBookingDate.format('DD MMMM YYYY');
    
    let bookingPdf = new jsPdf(
    {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts:true,
        floatPrecision: 16 // or "smart", default is 16
    }
    );

    bookingPdf.addImage(dealerHeader,'jpg',0,0,210,40);
    bookingPdf.setFontSize(11);
    bookingPdf.text(booking.title+' '+booking.name, 105, 50);
    bookingPdf.text(booking.firstAddress, 105, 55);
    bookingPdf.text(booking.secondAddress+' '+booking.thirdAddress, 105, 60);
    bookingPdf.text(booking.postal+' '+booking.city, 105, 65);
    /**SEPARATOR */
    bookingPdf.line(10,75,200,75)
    /**CONTRACT DETAILS */
    bookingPdf.setFontSize(14);
    bookingPdf.setFontStyle('bold');
    bookingPdf.text(typeOfBooking+' de location du '+firstBookingDate+' au '+lastBookingDate,10,85);
    bookingPdf.setFontSize(12);
    bookingPdf.text('Désignation du matériel : ',10,105);
    bookingPdf.setFontStyle('normal');
    bookingPdf.text(machine.nature+' '+machine.brand+' '+machine.type,10,110);
    bookingPdf.setFontStyle('bold');
    bookingPdf.text('Conditions tarifaires : ',10,120);
    bookingPdf.setFontStyle('normal');
    bookingPdf.text(booking.unitNumber+' '+unitChoice+' x '+booking.unitPrice+'€ H.T',10,125);
    bookingPdf.setFontSize(14);
    bookingPdf.setFontStyle('bold');
    bookingPdf.text('Conditions générales de location',10,135);
    bookingPdf.setFontSize(10);
    bookingPdf.setFontStyle('normal');
    bookingPdf.text('1. Les présentes conditions de location sont considérées comme étant acceptées par le locataire, par la seule signature du contrat.',10,140,{maxWidth:190});
    bookingPdf.text('2. Le bailleur donne location au preneur, qui accepte le matériel décrit dans la fiche d\'expertise ci-jointe et cela pour une période mentionnée sur ce contrat. Lors de la mise à disposition du matériel, un chèque de caution de 1500€ sera demandé au loueur : ce chèque ne sera pas encaissé.',10,148,{maxWidth : 190});
    bookingPdf.text('3. Le preneur s\'engage à payer le loyer au prix convenu dès le début de la période de location,à utiliser la matériel en bon père de famille et conformément aux stipulations du présent contrat.',10,160,{maxWidth : 190});
    bookingPdf.text('4. Le loyer présenté ci-dessus est payable anticipativement à la livraison du matériel. A défaut de paiement du loyer dans les délais, la bailleur a le droit de reprendre le matériel loué aux frais du preneur, indépendamment des frais de procédure. Dans ce cas le preneur reste tenu de payer les loyers pour la période de location convenue.',10,168,{maxWidth : 190});
    bookingPdf.text('5. Le preneur est tenu de réaliser l\'entretien journalier du matériel loué, et de maintenir le matériel en bon état de fonctionnement. Le bailleur est autorisé en tout temps d\'inspecter le matériel loué et le preneur devra à cette fin donner accès au matériel à tout moment.',10,180,{maxWidth : 190});
    bookingPdf.text('6. Le preneur est tenu de restituer le matériel, à la fin de la période de location prévue, dans l\'état dans lequel le matériel lui a été confié (cf: fiche d\'expertise). Des frais de nettoyage minimum de 125€ peuvent être facturés si le matériel n\’est pas rendu dans l\'état dans lequel il a été pris. Dans le cas où des dégradations seraient causées au matériel loué,le loueur s\'engage à payer les réparations effectuées afin de rendre le matériel dans l\’état dans lequel il a été confié.',10,192,{maxWidth : 190});
    bookingPdf.text('7. En cas de dépassement des heures de travail prévues, le prix appliqué aux heures supplémentaires sera celui indiqué dans la paragraphe "conditions tarifaires" ci-dessus.',10,208,{maxWidth : 190});
    bookingPdf.line(10,220,70,220);
    bookingPdf.line(140,220,200,220);
    bookingPdf.text('Signature client',10,225);
    bookingPdf.text('Signature loueur',140,225);

    bookingPdf.save(typeOfBooking+booking.name+'.pdf');
}

export default getBookingPdf;