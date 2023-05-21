import axios from "axios";
import {useRequest} from "ahooks";
import {useEffect, useState} from "react";
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
import { LazyLoadImage } from 'react-lazy-load-image-component';
import dayjs from "dayjs";
const getLanches = async (data) => {
  return axios.post('https://api.spacexdata.com/v5/launches/query', {
    options: data
  })
}

export default function HomePage() {
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
  }, [data])
  return (
    <Box sx={{mt:5}} style={{width: '1200px', margin: '0 auto'}}>
      <CssBaseline />
      <Container maxWidth="m" >
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
                  <ListItem disablePadding>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      {
                        item.map((innerItem, index) => (
                          <Grid xs={6}>
                            <Box>
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
                              <Button>detail</Button>
                            </Box>
                          </Grid>
                        ))
                      }
                    </Grid>
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
  )
}
