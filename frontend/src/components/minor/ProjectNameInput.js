import React from 'react' 
import { useSelector } from 'react-redux'

import InputField from 'components/reusable/InputField'

const ProjectNameInput = ({ projectName, setProjectName }) => {
  const err = useSelector(store => store.user.errors)

  return (
    <InputField 
      id="input-project-name"
      label="Project name"
      type="text" 
      value={projectName} 
      handleChange={setProjectName} 
      width="100%"
      error={err || projectName.length > 20}
      helperText={
        err & projectName.length === 0 || projectName.length === 0 ? 'This field is required' :
        projectName.length > 20 ? 'Cannot be longer than 20 characters' : ''
      } 
    />
  )
}

export default ProjectNameInput