import { useEffect, useState } from 'react'
import { Map, Marker, useMap, } from '@vis.gl/react-google-maps';
import axios from 'axios';
import { FoodTruck } from '../models/truck.ts'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { FoodTruckMenu } from '../models/menu.ts';
import { motion } from 'framer-motion';
import BasicTabs from './MenuView.tsx';
import { marker } from '../assets/market.ts';
var iconPin = {
  path: 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z',
  fillColor: '#64be67',
  fillOpacity: 1,
  scale: 0.05, //to reduce the size of icons
};
const MyMap = () => {
  const [bounds, setBounds] = useState<LatLngBoundsPayload | null>(null)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
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
    if (!bounds) return
    axios.post('https://kjbn-truck-nest.onrender.com/truck/getinbounds', bounds).then((data) => {
      setDataList(data.data as FoodTruck[])
    })
  }, [bounds])


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition(position)
    });
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

          <h6 className='px-4 font-serif text-2xl'>Food Trucks</h6>
          <hr />
          {
            dataList.map((item, index) => {
              return (
                <motion.div
                  initial={{ y: '10%' }}
                  animate={{ y: 0, x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ ease: 'easeOut', duration: 0.3, delay: 0.1 * index }}

                >
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
                </motion.div>
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
          <Marker

            onClick={() => { setCurrentTruck(null) }}
            position={{ lat: currentPosition?.coords.latitude as number, lng: currentPosition?.coords.longitude as number }}

          ></Marker>
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

