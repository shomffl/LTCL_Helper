import React from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@material-ui/core/Button';


/**
 * 検索フォーム
 */
const SearchBox = (props) => {
    
    // 検索ワードの入力内容を取得
    const handleFreeword = (event) => {
        // 入力に空白があれば"/"に置換
        // 空白は半角でも全角でも良い
        props.setFreeword(event.target.value.replace(/\s+/g,'/'));
    };
    
    return (
        <Grid container spacing={1} sx={{ mb: 7 }}>
            <Grid item xs={8}>
                <Paper
                    component="form"
                    sx={{
                        p: "4px",
                        display: "flex",
                        alignItems: "center",
                        width: "70%",
                        ml: "auto", 
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="検索ワードを入力してください"
                        inputProps={{ 'aria-label': 'search word' }}
                        onChange={ (event) => handleFreeword(event) }
                        onKeyDown={ (event) => {if (event.key === 'Enter') event.preventDefault(); }}
                    />
                </Paper>
            </Grid> 
            <Grid item xs={2}>
                <Button 
                    variant="contained" 
                    startIcon={<SearchIcon />} 
                    sx={{ 
                        backgroundColor: '#771AF8', 
                        color: 'white', 
                        height: '100%', 
                        '&:hover': {
                            backgroundColor: '#6633CC' 
                        } 
                    }}
                >
                </Button>
            </Grid>
        </Grid>
    );
};

export default SearchBox;