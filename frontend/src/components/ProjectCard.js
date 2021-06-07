import React from 'react'
import styled from 'styled-components/macro'

const ProjectContainer = styled.div`
  background-image: url(${props => props.image ? props.image : '/assets/landing-page-placeholder-image.jpg' });
  background-repeat: no-repeat;
  background-size: cover;
  height: 180px;
  width: 100%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;

  &::after {
    content: '';
    top: 0;
    left: 0;
    height: 180px;
    width: 100%;
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
  }
`

const ProjectName = styled.p`
  font-size: 2.4em;
  margin: 0;
  z-index: 1;
  font-weight: 500;
`

const ProjectDescription = styled.p`
  font-size: 1.8em;
  margin: 0;
  z-index: 1;
`

const ProjectCard = ({ item }) => {
  return (
    <ProjectContainer image={item.image}>
      <ProjectName>{item.name}</ProjectName>
      <ProjectDescription>{item.description}</ProjectDescription>
    </ProjectContainer>
  )
}

export default ProjectCard