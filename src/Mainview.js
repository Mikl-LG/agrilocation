import React,{Component} from 'react';
import ButtonAppBar from './Appbar.js';
import Machinegridlist from './components/machinegridlist.js';
import Addmachine from './components/addmachine.js';
import Machine_catalog from './constants/machine_catalog.js';
import Customers_catalog from './constants/customers.js';
import Dealer from './constants/dealer.js';
import Booking from './components/booking.js';
import { Container } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { Typography,Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Axios from 'axios';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import 'moment/locale/fr';


class Mainview extends Component{
    constructor(props){
        super(props)
        this.state={action:'home'}
        
    }

    theme = createMuiTheme({
        palette: {
          primary: {main:'#84BC38'},
          secondary: {main:'#84BC38'}
        },
        status: {
          danger: 'orange',
        },
    });

    handleMachineAction = (machine,action)=>{
        /**SET THE STATE : MACHINE = MACHINE PARAMETERS FROM CATALOG, ACTION = PAGE TO SET, ALLBOOKINGDATES = MERGING ALL THE DAY BOOKED FOR THE MACHINE */
        let allBookingDates = [];
        if(machine.booking){
            machine.booking.filter(
                element=>element.status==='contract'
            ).forEach(
                element => {
                allBookingDates = [...allBookingDates,...element.booking_dates];
            });
        }
        this.setState({machine:machine,action:action,allBookingDates:allBookingDates})
    }

    setContractToState=(contract)=>{
        this.setState({'contract':contract});
        //const datefromBookingDates = bookingDates.map((element)=>((element)));
    }
    setNavigationHeader=(dealerColor,dealerBackgroundColor,titleColor)=>{
        const action = this.state.action
        let icon='';
        let title = '';

        switch(action){
            case 'home':
                icon = 'home';
                title = 'accueil';
                break;
            default:
                icon = 'arrow_back';
                title = 'retour';
        }

        return(
            <div className='marginTopBottom30'>
                <div>
                    <IconButton aria-label='Home' onClick={()=>this.setState({action:'home'})}>
                        <Icon style={{color:'#515150'}}>{icon}</Icon>
                    </IconButton>
                </div> 
                <div>
                    <Typography variant="h6" style={{color:titleColor,marginLeft:'15px'}}>
                    {title.toUpperCase()}
                    </Typography>
                </div>
                {
                this.state.action==='home'
                &&
                    <div style={{textAlign:'right'}}>
                        <Button
                            variant="contained"
                            onClick={()=>this.setState({action:'new_machine'})}
                            style={{color:dealerColor,backgroundColor:dealerBackgroundColor}}
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            Ajouter une machine
                        </Button>
                    </div>
                }
                
            </div>
        )
        
    }

    async componentDidMount(){
        await Promise.resolve(this.setState({Machine_catalog:Machine_catalog}));
        await Promise.resolve(this.setState({dealer:Dealer[0]}));
        await Promise.resolve(this.setState({Customers_catalog:Customers_catalog}));
        
        try{
            const axiosResponse = await Axios({
              method: "get",
              url: 'http://localhost:4001/get/machine'
            });
            
            const MACHINE_CATALOG = axiosResponse.data;
            //console.log('machines : ',MACHINE_CATALOG.data);
            
            }
            catch(error){
                console.log('error: ',error);
            }
        
        
    }

    componentDidUpdate(){
        console.log('state : ',this.state);
    }

    render(){
        const dealer = this.state.dealer;
        const action = this.state.action;
        const machine = this.state.machine
        const machineCatalog = this.state.Machine_catalog;
        const customersCatalog = this.state.Customers_catalog;
        const dealerColor = this.state.dealer&&this.state.dealer.color;
        const dealerBackgroundColor = this.state.dealer&&this.state.dealer.backgroundColor;
        const titleColor = '#515150';

        return(
            
            <div>
                <ThemeProvider theme={this.theme}>
                    <ButtonAppBar 
                        color={dealer&&dealer.color?dealer.color:'grey'} 
                        backgroundColor={dealer&&dealer.backgroundColor?dealer.backgroundColor:'#E4B363'} 
                        title={dealer&&dealer.name?dealer.name:'AGRILOCATION'}
                    />
                    
                    <Container>
                        
                        {
                            this.setNavigationHeader(dealerColor,dealerBackgroundColor,titleColor)
                        }
                        {
                            action==='booking'
                            ?<Booking
                                machine={machine}
                                dealer={dealer}
                                Customers_catalog={customersCatalog}
                                setContractToState={this.setContractToState}
                                allBookingDates={this.state.allBookingDates}/>
                            :(action==='new_machine'
                            ?<Addmachine 
                            titleColor={titleColor}
                            dealerColor={dealerColor}
                            dealerBackgroundColor={dealerBackgroundColor}>

                            </Addmachine>
                            :<Machinegridlist handleMachineAction={this.handleMachineAction} machine_catalog={machineCatalog}/>)
                        }
                    </Container>
                </ThemeProvider>
            </div>
            
        )
    }
}
export default Mainview