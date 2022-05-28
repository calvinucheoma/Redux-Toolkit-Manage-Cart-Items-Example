import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import cartItems from '../../cartItems';
import axios from 'axios';
// import { openModal } from '../modal/modalSlice';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    amount: 1,
    total: 0,
    isLoading: true,
};

export const getCartItems = createAsyncThunk('cart/getCartItems', 
    async (name, thunkAPI) => {
        try{
            // console.log(name);
            // console.log(thunkAPI);
            // console.log(thunkAPI.getState());
            // thunkAPI.dispatch(openModal());
            const resp = await axios(url);
            return resp.data;
        } catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state,action) => {
           state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        },
        increase: (state, {payload}) => { //alternative way of destructuring the payload property from the action object
           const cartItem = state.cartItems.find((item) => item.id === payload);
               cartItem.amount++;
   
        },
        decrease: (state, {payload}) => { //alternative way of destructuring the payload property from the action object
           const cartItem = state.cartItems.find((item) => item.id === payload);
               cartItem.amount--;
   
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;
            });

            state.amount = amount;
            state.total = total.toFixed(2);
        },

    },
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true;
        },
        [getCartItems.fulfilled]: (state,action) => {
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.rejected]: (state, action) => {
            state.isLoading = false;
            alert(action.payload);
        },
    },
});

export default cartSlice.reducer;
export const {clearCart, removeItem, increase, decrease, calculateTotals} = cartSlice.actions;