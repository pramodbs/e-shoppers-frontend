// src/components/common/AppHeader.jsx
import React from 'react'
import { AppBar, Toolbar, Box, Typography, TextField, InputAdornment, IconButton, Button, Stack, Badge } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { itemsForRole } from '../../auth/permissions'

export default function AppHeader(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const role = user?.role || 'USER'
  const navItems = user ? itemsForRole(role) : []

  return (
    <AppBar position='sticky' color='primary' elevation={1}>
      <Toolbar sx={{ gap: 2, py: 1 }}>
        <Stack direction='row' alignItems='center' spacing={1} component={Link} to={user? '/admin' : '/'} style={{ color: 'inherit', textDecoration: 'none' }}>
          <StorefrontOutlined/>
          <Typography variant='h6' fontWeight={800}>E‑Shoppers</Typography>
        </Stack>

        <Box sx={{ flex: 1, maxWidth: 720 }}>
          <TextField
            fullWidth size='small' placeholder='Search for products, brands and more'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon/>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack direction='row' spacing={1} alignItems='center'>
          {!user && (
            <>
              <Button color='inherit' component={Link} to='/login'>Login</Button>
              <Button variant='contained' color='secondary' component={Link} to='/register'>Register</Button>
            </>
          )}
          {user && (
            <>
              <Typography variant='body2' sx={{ mr: 1 }}>Hi, {user.firstName}</Typography>
              <Button color='inherit' onClick={()=>{ logout(); nav('/login') }}>Logout</Button>
            </>
          )}

          <IconButton color='inherit'>
            <Badge color='secondary' badgeContent={0}>
              <ShoppingCartOutlined/>
            </Badge>
          </IconButton>
        </Stack>
      </Toolbar>

      {/* Role-aware quick links */}
      <Toolbar variant='dense' sx={{ gap: 2, backgroundColor: 'primary.dark' }}>
        {user && navItems.map(item => (
          <Button key={item.path} component={Link} to={item.path} color='inherit' size='small'>
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  )
}
