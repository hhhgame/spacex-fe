import ReactPlayer from 'react-player'
import { useMatch, useLocation } from 'umi';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Link from '@mui/joy/Link';
import dayjs from 'dayjs';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { history } from 'umi';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: '1px solid #444744'
                }
            }
        }
    }
    // palette: {
    //   mode: 'dark',
    //   primary: {
    //     main: '#ffffff',
    //     b
    //   },
    // },
});

const Detail = () => {
    const location  = useLocation();
    const [lanchInfo, setLanchInfo] = useState<any>()
    useEffect(() => {
        setLanchInfo(location.state)
    }, [location])
    return (
        <div>
            <Box sx={{
                padding: '20px',
                '& > div': {
                    display: 'block',
                    width: '100% !important',
                    minHeight: '640px',
                    color: '#fff'
                }
            }}>
                <a style={{
                    cursor: 'pointer',
                    display: 'block',
                    color: darkTheme?.components?.MuiButton?.styleOverrides?.root?.color,
                    display: 'block',
                    marginBottom: '20px'
                }} onClick={() => {
                    history.push('/')
                }}>&lt; BACK TO LANCHES</a>
                { lanchInfo &&
                    <>
                        <ReactPlayer url={lanchInfo.links.webcast} />
                        <p style={{
                            color: darkTheme?.components?.MuiButton?.styleOverrides?.root?.color
                        }}>{dayjs(lanchInfo.date_utc).format('MMMM DD, YYYY ')}</p>
                        <p style={{
                            color: darkTheme?.components?.MuiButton?.styleOverrides?.root?.color
                        }}>{lanchInfo.details}</p>
                    </>
                }
            </Box>
        </div>
    )
}

export default Detail