import React from 'react'
import styled from 'styled-components/macro'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { API_URL, SINGLE_PROJECT } from 'reusable/urls'

import projects from 'reducers/projects'

import Button from 'components/reusable/Button'

const DeleteProjectButton = styled.button`

`

const DeleteProject = ({ projectID }) => {
  const accessToken = useSelector(store => store.user.info.accessToken)
  
  const dispatch = useDispatch()
  const history = useHistory()

  const handleDeleteProject = () => {
    const config = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      }
    }

    fetch(API_URL(SINGLE_PROJECT(projectID)), config)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          dispatch(projects.actions.deleteProject(data))
          history.push('/authenticated/projects')
        } else {
          dispatch(projects.actions.setErrors(data))
        }
      })
  }
  return (
    <Button 
      btnText="DELETE PROJECT" 
      handleClick={handleDeleteProject}
    />
  )
}

export default DeleteProject