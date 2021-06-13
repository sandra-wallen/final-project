import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Link, useParams, useHistory } from 'react-router-dom'

import { API_URL, TASKS_URL } from 'reusable/urls'

import tasks from 'reducers/tasks'

import TasksSectionHeader from 'components/containers/TasksSectionHeader'
import TaskCard from 'components/containers/TaskCard'
import NewTask from 'components/containers/NewTask'

const Section = styled.section`
  width: 85%;
  padding: 50px;
  display: flex;
  flex-direction: column;
`

const TasksWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  grid-gap: 25px;
  max-height: 80%;
  overflow-y: auto;
  padding: 0px 10px;
  margin-top: 20px;
  
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f3f3;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dfdbe5;
    border-radius: 5px;
  }
`



const TasksSection = () => {
  const { projectID } = useParams()

  const accessToken = useSelector(store => store.user.info.accessToken)
  const items = useSelector(store => store.tasks.items)

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      }
    }

    fetch(API_URL(TASKS_URL(projectID)), options)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          dispatch(tasks.actions.setTasks(data))
        } else {
          dispatch(tasks.actions.setErrors(data))
        }
      })
  }, [accessToken, dispatch, projectID])
  
  const handleEditProject = () => {
    history.push(`/authenticated/project/${projectID}`)
  }

  return (
    <Section>
      <TasksSectionHeader 
        projectID={projectID}
        handleEditProject={handleEditProject}
      />
      <Route path="/authenticated/:projectID/tasks/new">
        <NewTask />
      </Route>
      <TasksWrapper>
        {items.map(item => (
          <TaskCard 
            key={item._id} 
            item={item}
            projectID={projectID}
          />
        ))}
        
      </TasksWrapper>
    </Section>
  )
}

export default TasksSection
