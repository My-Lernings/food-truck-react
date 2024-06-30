import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { FoodTruckMenu } from '../models/menu';
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
interface TabPanelProps {
    children?: React.ReactNode;

    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ menu, onClose }: { menu: FoodTruckMenu, onClose: () => void }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', items: 'center', alignItems: 'center' }}>
                <Tabs scrollButtons value={value} onChange={handleChange} aria-label="basic tabs example">

                    {menu.categories.map((category, index) => <Tab key={index} label={category.name} {...a11yProps(index + 1)} />)}
                </Tabs>

                <button
                    onClick={onClose}
                    className='m-4 w-8 h-8 min-w-8 min-h-8 bg-slate-300 rounded-full p-2 flex items-center justify-center'

                >
                    X
                </button>
            </Box>
            {
                menu.categories.map((category, index) =>
                    <CustomTabPanel key={index} value={value} index={index}>
                        <List style={{ maxHeight: '100%', overflow: 'auto', width: '100%' }} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {
                                category.items.map((item, index) => {
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
                                                }}>
                                                <ListItemAvatar>

                                                    <img className='w-16 h-16 rounded' src={'https://picsum.photos/200'} />

                                                </ListItemAvatar>
                                                <div className="w-4"></div>
                                                <ListItemText primaryTypographyProps={{ lineHeight: 1 }} primary={item.title} secondary={"$" + item.price} />
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        className=' w-8 h-8 bg-slate-300 rounded-full p-2 flex items-center justify-center'

                                                    >
                                                        -
                                                    </button>
                                                    <p>{0}</p>

                                                    <button
                                                        className=' w-8 h-8 bg-slate-300 rounded-full p-2 flex items-center justify-center'

                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </ListItem>
                                        </motion.div>
                                    )
                                })
                            }
                        </List>
                    </CustomTabPanel>)
            }
        </Box>
    );
}
