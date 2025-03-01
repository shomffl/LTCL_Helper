import React, { useState, useEffect } from 'react';
import axios from "axios";

import { makeStyles } from "@material-ui/styles";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import Typography from '@material-ui/core/Typography';
import Grid from '@mui/material/Grid';

import Info from './info';

const useStyles = makeStyles({
    root: {
        margin: 0,
        width: '100%',
        justifyContent: 'space-evenly',
    },
});


/**
 * 校舎情報(カレンダー)
 */
const Calendar = (props) => {
    const classes = useStyles();
    const [date, setDate] = useState(new Date());
    const [collegeInfo, setCollegeInfo] = useState([]);
    const [isDateClicked, setIsDateClicked] = useState(false);
    const [resError, setResError] = useState(false);
    const [exists, setExists] = useState({});
    const today = new Date();
    
    useEffect(() => {
        setResError(false);
        
        if ( (date.getMonth() >= today.getMonth() - 1) && (date.getMonth() <= today.getMonth()) ) {
            // 指定された日付の校舎情報取得
            axios
                .get(`/react/college/${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`)
                .then(response => {
                    setCollegeInfo(response.data);
                    setIsDateClicked(true);
                    const existInfo = {
                        zoom: response.data.zoom.exist,
                        collegeStaff: response.data.staff[0] ? true : false,
                        onlineStaff: response.data.online_staff[0] ? true : false,
                    };
                    setExists(existInfo);
                }).catch(error => {
                    setResError(true);
                    console.log(error);
                });
        }
    }, [date]);
    
    let info;
    if ( (date.getMonth() >= today.getMonth() - 1) && (date.getMonth() <= today.getMonth()) ) {
        info = (
            <Info 
                collegeInfo={ collegeInfo }
                isDateClicked={ isDateClicked }
                resError={ resError }
                zoom_link={ props.zoom_link }
                exists={ exists }
            />
        );
        
    } else {
        info = (
            <Typography  component="div" sx={{ paddingTop: 2, fontSize: 20 }}>
                確認可能なのは先月、今月の情報のみです。<br />
                もう一度日付を選択し直してください。
            </Typography>
        );
        
    }
    
    return (
        <div className="college_info">
            <Grid container columns={16} sx={{ width: '80%', ml: 'auto', mr: 'auto' }}>
                <Grid item xs={8}>
                    <Typography component="div" sx={{ color: '#771AF8', fontWeight: 'bold', fontSize: 24, pl: 2 }}>
                        { date.getMonth() + 1 }月{ date.getDate() }日の校舎情報
                    </Typography>
                    { info }
                </Grid>
                <Grid item xs={8}>
                    <LocalizationProvider dateAdapter={ AdapterDateFns }>
                        <CalendarPicker className={classes.root} date={ date } onChange={ (newDate) => { setDate(newDate), setIsDateClicked(false) } } />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </div>
    );
};

export default Calendar;