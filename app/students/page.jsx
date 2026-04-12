// components/Students.jsx
"use client"

import React, { useState } from 'react'
import { BiSearch, BiTrash } from 'react-icons/bi'
import moment from 'moment'
import { BsEye, BsFilter } from 'react-icons/bs'
import { get, remove } from '../utils/axiosHelpers'
import { IoArrowDownOutline } from 'react-icons/io5'
import Link from 'next/link'
import Alert from '../components/alert/Alert'
import ConfirmationModal from '../components/confirmationModal/ConfirmationModal'
import ArrayItemLoader from '../components/arrayItemLoader/ArrayItemLoader'
import useFetch from '../hooks/useFetch'
import useCacheStore from '../stores/cacheStore'
import BtnLoader from '../components/btnLoader/BtnLoader'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'
import * as XLSX from 'xlsx'

const Students = () => {
  const { data, error, loading, refetch } = useFetch(
    "https://backend.wificombatelearn.com/administration/get-users?role=user",
    { cacheTime: 5 * 60 * 1000 } // 5 minutes cache
  )

  const [paginatedData, setPaginatedData] = useState(null)
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState('')
  const [alertType, setAlertType] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)
  const [load, setLoad] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const { getCacheData, setCacheData, clearCacheByPattern } = useCacheStore()

  const getPaginatedData = async (url) => {
    try {
      // Check cache with a shorter duration (5 minutes)
      const cachedData = getCacheData(url, 5 * 60 * 1000)
      
      if (cachedData) {
        setPaginatedData(cachedData)
        return
      }

      setLoad(true)
      const response = await get(url)
      if(response) setLoad(false)
      setPaginatedData(response)
      setCacheData(url, response)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteStudent = async (id) => {
    try {
        setLoad(true)
        const response = await remove(`/administration/get-users/${id}`)
        if(response) setLoad(false)
        if (response?.success) {
            setMsg('Student deleted successfully')
            setAlertType('success')
            setConfirmModal(false)
            
            // Clear all student-related caches
            clearCacheByPattern('get-users')
            
            // Refetch the current data
            await refetch()
        } else {
            setMsg('An error occurred')
            setAlertType('error')
        }
    } catch (error) {
      console.log(error)
      setMsg('An error occurred')
      setAlertType('error')
    } finally {
      setConfirmModal(false)
    }
  }

  // Export students data to Excel
  const exportToExcel = async () => {
    try {
      setExportLoading(true)
      
      // If we're using pagination, we might need to fetch all students
      // For simplicity, we'll use the currently displayed students
      const studentsToExport = students?.data || []
      
      if (studentsToExport.length === 0) {
        setMsg('No students data to export')
        setAlertType('error')
        setExportLoading(false)
        return
      }

      // Format the data for Excel
      const formattedData = studentsToExport.map(student => ({
        'Name': student.full_name || 'N/A',
        'Email': student.email,
        'Date Created': student.created_at ? moment(student.created_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'
      }))

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      
      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      
      // Create blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Students_${moment().format('YYYY-MM-DD')}.xlsx`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setMsg('Students data exported successfully')
      setAlertType('success')
    } catch (error) {
      console.error('Export error:', error)
      setMsg('Failed to export students data')
      setAlertType('error')
    } finally {
      setExportLoading(false)
    }
  }

  // Use paginatedData if available, otherwise use initial data
  const students = paginatedData || data

  return (
    <div className="w-[82.5%] px-8 py-6 mx-auto relative top-[8.5rem] left-1/2 transform -translate-x-1/2">
      {msg && <Alert alertType={alertType} msg={msg} setMsg={setMsg} />}
      {confirmModal && (
        <ConfirmationModal
          modalInfo={{
            title: 'Delete Student',
            content: 'Are you sure you want to delete this student?',
            confirmButtonText: 'Delete',
            confirmFunction: () => deleteStudent(confirmModal.id),
          }}
          setConfirmModal={setConfirmModal}
          load={load}
        />
      )}
      <div className="w-[100%] border py-5 rounded-[10px]">
        <div className="mx-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[#101828] text-[19px]">Students</p>
              <p className="text-[#056494] bg-[#E6F6FE] py-1 px-[8px] rounded-full">
                {students?.count} students
              </p>
            </div>
            <p className="text-[#475467] text-[14px]">Oversee all students activities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="border flex items-center p-2 rounded-[8px] w-[300px]">
              <BiSearch className="text-[18px]" />
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-full outline-none pl-1"
                placeholder="Search"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 border p-2 rounded-[8px] cursor-pointer">
                <BsFilter className="text-[18px]" />
                <p>Filter</p>
              </div>
              <button 
                className='border p-2 rounded-[8px] cursor-pointer flex items-center justify-center'
                onClick={exportToExcel}
                disabled={exportLoading || loading || !students?.data?.length}
                title="Export to Excel"
              >
                {exportLoading ? (
                  <span className="w-4 h-4 border-2 border-t-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"/>
                ) : (
                  <PiMicrosoftExcelLogoFill className="text-green-600" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#475467] border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#1D2939] font-medium">
                <th className="py-4 px-4">
                  <div className="flex gap-1 items-center">
                    <p>Students</p>
                    <IoArrowDownOutline className="text-sm" />
                  </div>
                </th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4">Activity</th>
                <th className="py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {students?.data?.filter(student =>{
                if (search === "") return student
                else if(
                        // student.full_name.toLowerCase().includes(search.toLowerCase())
                        student.email.toLowerCase().includes(search.toLowerCase())
                    )return student
              }).map((student, index) => (
                <tr
                  key={index}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="py-4 pl-4 flex items-center gap-3">
                    <img
                        src={student?.profile_pic?.media ? student?.profile_pic?.media : '/assets/student-avatar.svg'}
                        className="w-[40px] h-[40px] rounded-full object-cover"
                        alt={student.first_name}
                    />
                    <div className='flex items-center gap-2'>
                      <p className="font-medium text-[#1D2939]">{student.first_name ? student.first_name : 'N/A'}</p>
                      <p className="font-medium text-[#1D2939]">{student.last_name ? student.last_name : 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">{student.email}</td>
                  {
                      student.last_login ?
                      <td className="py-4 px-4 capitalize">{ moment(student.last_login).fromNow() }</td>
                      :
                      <td className="py-4 px-4">N/A</td>
                  }
                  <td className="py-4 px-4">
                    <Link
                      href={`/activity/${student.id}`}
                      className="bg-[#E6F6FE] text-[#0784C3] px-2 py-1 rounded-full"
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-4 flex gap-8 items-center">
                    <Link href={`/students/${student.id}`}>
                      <BsEye className="cursor-pointer text-[18px] text-[#1D2939] hover:text-blue-500" />
                    </Link>
                    <BiTrash
                      onClick={() => setConfirmModal({ id: student.id })}
                      className="cursor-pointer text-[18px] text-red-500 hover:text-red-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="px-8">
              <ArrayItemLoader />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-4 border-t pt-4 text-[#475467] text-[14px]">
          <p>
            Page {students?.current_page} of {students?.total_pages}
          </p>
          {
              load ?
                  <BtnLoader />
              :
                  <div className="flex gap-2">
                      {students?.previous !== null && (
                          <button
                              className="border px-3 py-1 rounded-[6px]"
                              onClick={() => getPaginatedData(students.previous)}
                          >
                              Previous
                          </button>
                      )}
                      {students?.next !== null && (
                          <button
                              className="border px-3 py-1 rounded-[6px]"
                              onClick={() => getPaginatedData(students.next)}
                          >
                              Next
                          </button>
                      )}
                  </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Students