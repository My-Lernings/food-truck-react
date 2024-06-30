import { useEffect, useState } from 'react'
import { Map, Marker, useMap, } from '@vis.gl/react-google-maps';
import axios from 'axios';
import { FoodTruck } from '../models/truck.ts'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { FoodTruckMenu } from '../models/menu.ts';
import { motion } from 'framer-motion';
import BasicTabs from './MenuView.tsx';
const MyMap = () => {
  const [bounds, setBounds] = useState<LatLngBoundsPayload | null>(null)
  // const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [menu, setMenu] = useState<FoodTruckMenu | null>(null)
  const [currentTruck, setCurrentTruck] = useState<FoodTruck | null>(null)
  const [dataList, setDataList] = useState<FoodTruck[]>([])
  const map = useMap();

  useEffect(() => {
    if (!currentTruck) return
    axios.get('https://kjbn-truck-nest.onrender.com/truck/menu/12').then((data) => {
      setMenu(data.data as FoodTruckMenu)
      console.log(data.data)
    })
  }, [currentTruck])

  useEffect(() => {
    if (!map) return
    const bounds = map!.getBounds();
    console.log(bounds)
  }, [map])

  useEffect(() => {
    if (!map) return
    if (!bounds) return
    axios.post('https://kjbn-truck-nest.onrender.com/truck/getinbounds', bounds).then((data) => {
      setDataList(data.data as FoodTruck[])
    })
  }, [bounds])


  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   // setCurrentPosition(position)
    // });
  }, [])
  return (
    <div className='w-full h-full'>
      {menu != null && <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '1%' }}
        exit={{ x: '100%' }}
        transition={{ ease: 'easeOut', duration: 0.3 }}

        className="bg-white fixed flex flex-col w-1/5 h-full scroll-y-auto  left-1/4 z-10">
        <BasicTabs menu={menu} onClose={() => setMenu(null)} />

      </motion.div>}
      {dataList.length > 0 && <div className="fixed flex flex-col w-1/4 h-full scroll-y-auto  left-0 z-10">
        <List style={{ maxHeight: '100%', overflow: 'auto', width: '100%' }} sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {
            dataList.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  onClick={() => {
                    map?.panTo({ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) })
                    setCurrentTruck(item)
                  }}>
                  <ListItemAvatar>
                    <Avatar>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primaryTypographyProps={{ lineHeight: 1 }} primary={item.applicant} secondary={item.address} />
                  <ListItemAvatar>
                    <Avatar>
                    </Avatar>
                  </ListItemAvatar>
                </ListItem>
              )
            })
          }
        </List>

      </div>}
      <div className={`${menu != null ? 'ml-[20%]' : ''}}`}>
        <Map
          onBoundsChanged={(event) => {
            if (event.type === "bounds_changed") {
              const bounds = (event.detail.bounds)
              setBounds({
                minlat: bounds.north,
                minlon: bounds.east,
                maxlat: bounds.south,
                maxlon: bounds.west,
              })
            }
          }}
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={{ lat: 37.7577, lng: -122.4376 }}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {
            dataList.length > 0 && dataList.map((item, index) => {
              return <Marker
                key={index}
                onClick={() => { setCurrentTruck(item) }}
                position={{ lat: item.location.coordinates[1], lng: item.location.coordinates[0] }} >

              </Marker>
            })
          }
        </Map>
      </div>
    </div>
  )
}

export default MyMap

interface LatLngBoundsPayload {
  minlat: number,
  minlon: number,
  maxlat: number,
  maxlon: number
}

