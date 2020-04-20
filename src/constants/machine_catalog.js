const machine_catalog=[
    {
        id:1,
        nature:'tracteur',
        brand:'kubota',
        type:'m7152',
        options:'transmission à variation continue, relevage avant',
        horspower:150,
        day_price:180,
        hour_price:18,
        image_url:'https://inspekt-prod.s3.eu-west-3.amazonaws.com/INSPEKT_OPEN_MEDIAS/DSCN6353.jpg'
    },
    {
        id:2,
        nature:'tracteur',
        brand:'kubota',
        type:'m7172',
        options:'transmission à variation continue, chargeur frontal',
        horsepower:170,
        day_price:210,
        hour_price:21,
        image_url:'https://inspekt-prod.s3.eu-west-3.amazonaws.com/INSPEKT_OPEN_MEDIAS/XdwHu4jrPE-ErLm6uGPbMA_1.jpg'
    },
    {
        id:3,
        nature:'tracteur',
        brand:'john deere',
        type:'6150R',
        options:'transmission à variation continue',
        horsepower:150,
        day_price:180,
        hour_price:18,
        booking:[
            {
                customer_name:'GAEC DURAND',
                customer_address:'4 route des lilas',
                customer_postal:'21000',
                customer_city:'DIJON',
                customer_phone:'03 80 20 21 27',
                customer_cellphone:'06 78 95 46 51',
                customer_email:'gaecdurand@wanadoo.fr',
                booking_dates:['2020-4-21','2020-4-22','2020-4-23','2020-4-24','2020-4-25','2020-4-26'],
                status:'estimate',
                unit:'day',
                price_per_unit:'200',
                unit_number:'5'
            },
            {
                customer_name:'GAEC LANGLAIS',
                customer_address:'le vieux chene',
                customer_postal:'71000',
                customer_city:'CHALON SUR SAONE',
                customer_phone:'03 85 67 89 65',
                customer_cellphone:'06 42 56 98 76',
                customer_email:'gaeclanglais@orange.fr',
                booking_dates:['2020-5-9','2020-5-10','2020-5-11'],
                status:'contract',
                unit:'day',
                price_per_unit:'170',
                unit_number:'3'
            },{
                customer_name:'EART DES ARBRES',
                customer_address:'Avenue des noisetiers',
                customer_postal:'21200',
                customer_city:'BEAUNE',
                customer_phone:'03 80 20 18 30',
                customer_cellphone:'06 50 76 87 98',
                customer_email:'earl-des-charmes@wanadoo.fr',
                booking_dates:['2020-6-21','2020-6-22','2020-6-23','2020-6-24','2020-6-25','2020-6-26'],
                status:'contract',
                unit:'day',
                price_per_unit:'150',
                unit_number:'5'
            }
        ],
        image_url:'https://inspekt-prod.s3.eu-west-3.amazonaws.com/INSPEKT_OPEN_MEDIAS/john-deere-6150r%2C4608_1.jpg'
    },
    {
        id:4,
        nature:'tracteur',
        brand:'fendt',
        type:'712',
        options:'attelage K80',
        horsepower:120,
        day_price:150,
        hour_price:15,
        blockedDates:[],
        image_url:'https://inspekt-prod.s3.eu-west-3.amazonaws.com/INSPEKT_OPEN_MEDIAS/NaNkx5tv.jpg'
    },
    {
        
        id:5,
        nature:'tracteur',
        brand:'deutz fahr',
        type:'7250',
        options:'relevage avant',
        horsepower:250,
        day_price:280,
        hour_price:28,
        blockedDates:[],
        image_url:'https://inspekt-prod.s3.eu-west-3.amazonaws.com/INSPEKT_OPEN_MEDIAS/deutz-fahr-7250-ttv%2C6158cde4-1.jpg'
    }
]

export default machine_catalog