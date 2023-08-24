"use client"
import Image from 'next/image';
import React, { Component } from 'react';

import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; 
export default function HomePageDown() {

    const images = ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.jpeg", '/images/5.png', '/images/6.jpeg']
  
  return (
    <>
        <Splide
            options={{
                autoplay: true,
                perPage : 5,
                interval: 3000
            }}>

                    {images.map((src: string) => {
                        return (
                            <SplideSlide>
                            <Image src={src} alt={src} height={256} width={256}>         
                            </Image>
                            </SplideSlide>          
                        )
                    })}




        </Splide>
    </>
    )
  }
  