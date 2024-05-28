//stores/hotels.js
import { defineStore } from 'pinia';
import { searchHotels } from '../api/hotel';

export const useHotelStore = defineStore('hotels', {
    state: () => ({
        recommendList: []
    }),
    actions: {
        async fetchHotels(formData) {
            console.log('666', formData);
            try {
                const response = await searchHotels(formData);
                console.log('88988989',response)
                //console.log('originalPrice', response.data.data[1].roomTypes);
                // 在这里对每个酒店的 tag 属性进行转换
                this.recommendList = response.data.data.map(hotel => ({
                    ...hotel,
                    tag: hotel.tag ? hotel.tag.split(',') : []
                }));
            } catch (error) {
                console.log('错误', error);
            }
        }
    }
});
