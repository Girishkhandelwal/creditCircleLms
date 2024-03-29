import Chart from '@/components/DashBoard/LoanTypeChart'
import React from 'react'
import CountBoxes from '../components/DashBoard/CountBoxes'

export default function index() {
  return (
    <>
      <CountBoxes />
      <Chart />
    </>
  )
}
