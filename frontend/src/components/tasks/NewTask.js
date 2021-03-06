import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { API_URL, TASKS_URL } from 'reusable/urls'

import tasks from 'reducers/tasks'

import NewTaskTitleInput from 'components/tasks/NewTaskTitleInput'
import Button from 'components/reusable/Button'

const TaskContainer = styled.div`
  background: #dfdbe5;
  width: 100%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  cursor: pointer;
`

const ButtonsContainer = styled.div`
  display: flex;
  align-self: flex-end;
`

const NewTask = ({ setNewItemMode }) => {
  const { projectID } = useParams()

  const [taskTitle, setTaskTitle] = useState('')

  const accessToken = useSelector(store => store.user.info.accessToken)

  const dispatch = useDispatch()

  const handleFormSubmit = () => {
    const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken
    },
    body: JSON.stringify({ title: taskTitle })
    }

    fetch(API_URL(TASKS_URL(projectID)), config)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch(tasks.actions.setNewTask(data.task))
          setNewItemMode(false)
        } else {
          dispatch(tasks.actions.setErrors(data))
        }
      })
  }

  return (
    <TaskContainer>
      <NewTaskTitleInput 
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
      />
      <ButtonsContainer>
        <Button 
          btnText="ADD"
          handleClick={handleFormSubmit}
          disabled={taskTitle.length !== 0 && taskTitle.length < 31 ? false : true}
        />
        <Button 
          btnText="CANCEL"
          handleClick={() => setNewItemMode(false)}
        />
      </ButtonsContainer>
    </TaskContainer>
  )
}

export default NewTask