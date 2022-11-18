import { List, ListItem, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { AdminRoutes } from '../../../Data/Routes/Admin/AdminRoutes'

export const NavBar = () => {

    const NavBackground = useColorModeValue("gray.100", "gray.700")

    return (
        <VStack
            height="calc(100vh - 6.5rem)"
            width="250px"
            bg={NavBackground}
        >
            <List
                m="15px"
                width="full"
                overflowY="auto"
            >
                {AdminRoutes.filter(val => val.guard.canActive).map((val, idx) =>
                    <ListItem key={idx}>
                        {/* @ts-ignore */}
                        <NavLink to={'/admin' + val.path}>
                        {/* @ts-ignore */}
                            {val.icon && <val.icon />} {val.name}
                        </NavLink>
                        <List ml="20px">
                            {val.child?.filter(val => val.guard.canActive).map((child, idx) =>
                                <ListItem key={idx}>
                                    <NavLink
                                        to={'/admin' + val.path + child.path}
                                    >
                                        {child.name}
                                    </NavLink>
                                </ListItem>
                            )}
                        </List>
                    </ListItem>
                )}
            </List>
        </VStack>
    )
}
