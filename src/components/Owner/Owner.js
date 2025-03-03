import React, { useState, useEffect } from 'react';
import { fetchDashboardPropertyDetails } from '../../API/api';
import './Owner.css';
import { IoEyeSharp, IoWalkSharp } from 'react-icons/io5';
import { FiSend } from 'react-icons/fi';
import { BiSolidBookmarkHeart } from 'react-icons/bi';
import BarRaceChart from '../../components/charts/BarRaceChart';
import PieChart from '../../components/charts/PieChart';
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import LineChart from '../../components/charts/Linechart/LineChart';
import { LiaRupeeSignSolid } from '../../assets/icons/Icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Owner = () => {
      const navigate = useNavigate();
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const agentListingProperty = useSelector((state )=> state.properties.selectedAgentProperty);
    const [propertyDetails, setPropertyDetails] = useState([]);
    const combineproperty = agentListingProperty || propertyDetails[0] || {};
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({
        registrationFee: '',
        brokerageFee: '',
        documentationFee: '',
        platformFee: '',
        netAmount: ''
    });
    const [selectedOfferId, setSelectedOfferId] = useState('');

    const offers = [
        { offername: "Offer-1", OfferId: '1', date: '23-07-2024', amount: '2.0 CR', amountValue: 20000000, days: 45, detailsLink: '#' },
        { offername: "Offer-2", OfferId: '2', date: '22-07-2024', amount: '1.9 CR', amountValue: 19000000, days: 30, detailsLink: '#' },
        { offername: "Offer-3", OfferId: '3', date: '21-07-2024', amount: '1.8 CR', amountValue: 18000000, days: 35, detailsLink: '#' },
        { offername: "Offer-4", OfferId: '4', date: '20-07-2024', amount: '1.75 CR', amountValue: 17500000, days: 28, detailsLink: '#' }

    ];

    const formatAmount = (amount) => {
        return <span><LiaRupeeSignSolid /> {amount}</span>;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDashboardPropertyDetails(bearerToken);
                setPropertyDetails(data);
            } catch (error) {
                setError(`Error fetching property details: ${error.message}`);
                console.error('Detailed Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [bearerToken]);

    const calculateFees = (amountValue) => {
        const amount = Number(amountValue); // Ensure amountValue is a number
        console.log("Calculating fees for amount:", amount);

        // Define fee percentages as decimals
        const registrationFeePercentage = 0.08; // 8%
        const brokerageFeePercentage = 0.01;    // 1%
        const documentationFeePercentage = 0.005; // 0.5%
        const platformFeePercentage = 0.002;     // 0.2%

        // Calculate fees based on percentages
        const registrationFee = amount * registrationFeePercentage;
        const brokerageFee = amount * brokerageFeePercentage;
        const documentationFee = amount * documentationFeePercentage;
        const platformFee = amount * platformFeePercentage;
        const totalFees = registrationFee + brokerageFee + documentationFee + platformFee;
        const netAmount = amount + totalFees; // Subtracting total fees from amount

        console.log("Calculated Fees:", {
            registrationFee,
            brokerageFee,
            documentationFee,
            platformFee,
            netAmount
        });

        return {
            registrationFee,
            brokerageFee,
            documentationFee,
            platformFee,
            netAmount
        };
    };

    const handleOfferChange = (event) => {
        const selectedId = event.target.value;
        setSelectedOfferId(selectedId);

        const selectedOffer = offers.find(offer => offer.OfferId === selectedId);
        if (selectedOffer) {
            const fees = calculateFees(selectedOffer.amountValue);
            setFormValues({
                registrationFee: formatNumberWithCommas(fees.registrationFee),
                brokerageFee: formatNumberWithCommas(fees.brokerageFee),
                documentationFee: formatNumberWithCommas(fees.documentationFee),
                platformFee: formatNumberWithCommas(fees.platformFee),
                netAmount: formatNumberWithCommas(fees.netAmount)
            });
        }
    };

    // Utility function to format numbers with commas
    const formatNumberWithCommas = (number) => {
        if (typeof number !== 'number') return '';
        return number.toLocaleString('en-IN', { style: 'decimal' });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (propertyDetails.length === 0) {
        return <p>No property details available.</p>;
    }

    const property = propertyDetails[0];

    // Prepare data for the half doughnut chart
    const BarraceChartData = [
        { value: 356, name: 'Investor' },
        { value: 624, name: 'Agent' },
        { value: 801, name: 'Buyer' },
    ];

    // Prepare data for the pie chart
    const ageData = [
        { value: 2350, name: '18-24' },
        { value: 3000, name: '25-35' },
        { value: 2740, name: '35-50' },
        { value: 2340, name: '50+' },
    ];

      const handlebacktoproperty = () => {
        navigate('/dashboard');
      };

    return (
        <>
         <div className='backtoproperty'>
                <button    onClick={() => handlebacktoproperty()}>My property </button>
         </div>
         <div className='ownerclass'>
           
           <div className='main-container'>
               <div className='first-column'>
                   <div className='details-column'>
                       <div className='property-info'>
                           <p className='ownerproperty-name'>{combineproperty.PropertyName},</p>
                           <span className='property-location'>{combineproperty.PropertyArea}</span>
                       </div>
                       <div className='details-grid'>
                           <div className='details-left'>

                               <p>Area: {combineproperty.SqFt}</p>
                               <p>Bedrooms: {combineproperty.PropertyBedrooms}</p>
                               <p>Bathrooms: {combineproperty.PropertyBathrooms}</p>
                              
                             
                           </div>
                           <div className='details-right'>
                               <p>Facing: {combineproperty.PropertyMainEntranceFacing} </p>
                               <p>Parking: Yes</p>
                               <p>GatedCommunity: Yes</p>
                           </div>
                       </div>
                   </div>
                   <div className='offers-table-container'>
                       <table className='offers-table'>
                           <thead>
                               <tr>
                                   <th>OfferId</th>
                                   <th>Date</th>
                                   <th>Amount</th>
                                   <th>Days</th>
                                   <th>More</th>
                               </tr>
                           </thead>
                           <tbody>
                               {offers.map((offer, index) => (
                                   <tr key={index} onClick={() => handleOfferChange({ target: { value: offer.OfferId } })}>
                                       <td>{offer.OfferId}</td>
                                       <td>{offer.date}</td>
                                       <td>{formatAmount(offer.amount)}</td>
                                       <td>{offer.days}</td>
                                       <td><a href={offer.detailsLink}>Details</a></td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
               <div className='stats-column'>
                   <div className='stats-container'>
                       <div className='stat-box views'>
                           <h3><IoEyeSharp /> Views</h3>
                           <p>{property.NumberOfViews}</p>
                       </div>
                       <div className='stat-box saves'>
                           <h3><BiSolidBookmarkHeart /> Saves</h3>
                           <p>{property.NumberOfSaves}</p>
                       </div>
                       <div className='stat-box shares'>
                           <h3><FiSend /> Shares</h3>
                           <p>500</p> {/* Placeholder value */}
                       </div>
                       <div className='stat-box tours'>
                           <h3><IoWalkSharp /> Tours</h3>
                           <p>50</p> {/* Placeholder value */}
                       </div>
                   </div>
                   <div className='charts-row'>
                       <div className='chart-box barrace'>
                           <BarRaceChart data={BarraceChartData} />
                       </div>
                       <div className='chart-box pie'>
                           <PieChart data={ageData} />
                       </div>
                   </div>
               </div>
               <div className='form-column'>
                   <form>
                       <div className='form-group'>
                           <label htmlFor='offerSelect'>Offer Revenue</label>
                           <select id='offerSelect' name='offerSelect' value={selectedOfferId} onChange={handleOfferChange}>
                               <option value='' >Select Offer</option>
                               {offers.map(offer => (
                                   <option key={offer.OfferId} value={offer.OfferId} >
                                       {offer.offername}
                                   </option>
                               ))}
                           </select>
                       </div>
                       <div className='form-group'>
                           <label htmlFor='registrationFee'>Registration Fee</label>
                           <input type='text' id='registrationFee' name='registrationFee' value={formValues.registrationFee} readOnly />
                       </div>
                       <div className='form-group'>
                           <label htmlFor='brokerageFee'>Brokerage Fee</label>
                           <input type='text' id='brokerageFee' name='brokerageFee' value={formValues.brokerageFee} readOnly />
                       </div>
                       <div className='form-group'>
                           <label htmlFor='documentationFee'>Documentation Fee</label>
                           <input type='text' id='documentationFee' name='documentationFee' value={formValues.documentationFee} readOnly />
                       </div>
                       <div className='form-group'>
                           <label htmlFor='platformFee'>Platform Fee</label>
                           <input type='text' id='platformFee' name='platformFee' value={formValues.platformFee} readOnly />
                       </div>
                       <div className='form-group'>
                           <label htmlFor='netAmount'>Net Amount</label>
                           <input type='text' id='netAmount' name='netAmount' value={formValues.netAmount} readOnly />
                       </div>
                   </form>
               </div>
           </div>
           <div className='linechart-container'>
               <div className='linechart-box'>
                   <LineChart />
               </div>
               <div className='transaction-history-box'>
                   <TransactionHistory />
               </div>
           </div>
       </div>
        </>
    
    );
};

export default Owner;
