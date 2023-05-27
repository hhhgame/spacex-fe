import axios from "axios";
import {useRequest} from "ahooks";
import { history } from 'umi';

import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {Button, Container} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import CssBaseline from '@mui/material/CssBaseline';
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/material/Modal';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import dayjs from "dayjs";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {green, orange} from '@mui/material/colors';
import Fade from '@mui/material/Fade';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const getLanches = async (data: any) => {
    return axios.post('https://api.spacexdata.com/v5/launches/query', {
        options: data
    })
}
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

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    // window?: () => Window;
    children: React.ReactElement;
}

function ScrollTop(props: Props) {
    const {children} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        // target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // @ts-ignore
        trigger && window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{position: 'fixed', bottom: 16, right: 16}}
            >
                {children}
            </Box>
        </Fade>
    );
}

export default function HomePage(props: Props) {
    const [pageInfo, setPageInfo] = useState<any>({
        page: 1,
        limit: 12,
    })
    const [listData, setListData] = useState<any[]>([])
    const {run, data, error, loading, params} =
        useRequest(getLanches, {
                defaultParams: [pageInfo]
            }
        );
    const loadMore = () => {
        console.log('loadMore')
        run({
            page: pageInfo.nextPage,
            limit: 12
        })
    }
    const [open, setOpen] = useState(true);
    useEffect(() => {
        if (data && data.data.docs) {
            // const aa = [...listData, _.chunk(data.data.docs, 2)]
            setListData(listData.concat(_.chunk(data.data.docs, 2)))
        }
        if (data && data.data) {
            setPageInfo({
                ...pageInfo,
                hasNextPage: data.data.hasNextPage,
                hasPrevPage: data.data.hasPrevPage,
                totalDocs: data.data.totalDocs,
                totalPages: data.data.totalPages,
                nextPage: data.data.nextPage,
            })
        }
        ``
    }, [data])

    function gotoDetail(item:any) {
        history.push('detail', item)
    }

    return (
        <div>
          <ThemeProvider theme={darkTheme}>
            <Box sx={{mt: 5}} style={{width: '1200px', margin: '0 auto', padding: '20px'}}>
              <CssBaseline/>
              <Container>
                <InfiniteScroll
                    dataLength={listData.length - 1}
                    hasMore={pageInfo.hasNextPage}
                    loader={loading}
                    next={loadMore}
                >
                  <List>
                    {
                      listData.length > 0 ? listData.map(item => {
                        return (
                            <ListItem key={item.date_utc} disablePadding>
                              <React.Fragment key={item.id}>
                                <Grid container rowSpacing={1}
                                      columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                  {
                                    item.map((innerItem: any, index: number) => (
                                        <React.Fragment key={innerItem.id}> <Grid xs={6}>
                                          <Box
                                              sx={{
                                                marginBottom: '10px',
                                                border: '1px solid #444744',
                                                marginRight: 10,
                                                padding: '20px',
                                                borderRadius: '15px'
                                              }}
                                          >
                                            <LazyLoadImage
                                                effect="blur"
                                                width={'100%'}
                                                // height={image.height}
                                                src={item[index]?.links.patch.large} // use normal <img> attributes as props
                                                // width={image.width} />
                                            />
                                            {/*<img style={{display: 'block', width: '100%'}} src={item[index]?.links.patch.large} />*/}
                                            <p>{dayjs(item[index].date_utc).format('MMMM DD, YYYY ')}</p>
                                            <p>{item[index].name}</p>
                                            <Button onClick={() => { gotoDetail(innerItem) }}>detail</Button>
                                          </Box>
                                        </Grid></React.Fragment>

                                    ))
                                  }
                                </Grid>
                              </React.Fragment>
                            </ListItem>
                        )
                      }) : <span>empty</span>
                    }
                  </List>
                  {loading && <LoadingButton loading loadingIndicator="Loading…" variant="outlined">
                  </LoadingButton>
                  }
                </InfiniteScroll>

              </Container>
            </Box>
              <ScrollTop {...props}>
                  <Fab size="small" aria-label="scroll back to top">
                      <KeyboardArrowUpIcon />
                  </Fab>
              </ScrollTop>
          </ThemeProvider>
        </div>
    )
}
