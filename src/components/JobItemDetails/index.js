import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiOutlineStar} from 'react-icons/ai'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'

import SimilarJobCard from '../SimilarJobCard'
import SkillsCard from '../SkillsCard'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: {},
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getSimilarJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedSkillData = data => ({
    name: data.name,
    imageUrl: data.image_url,
  })

  getJobDetailsFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachSkill => this.getFormattedSkillData(eachSkill)),
    title: data.title,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const token = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    const response = await fetch(jobDetailsApiUrl, options)
    const data = await response.json()
    const updatedData = this.getJobDetailsFormattedData(data.job_details)
    console.log(data)
    const updatedSimilarJobs = data.similar_jobs.map(eachSimilarJob =>
      this.getSimilarJobsData(eachSimilarJob),
    )
    console.log(updatedSimilarJobs)

    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedData,
        similarJobs: updatedSimilarJobs,
      })
      console.log(data)
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickJobsList = () => {
    this.getJobDetails()
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="success-details-container">
        <div className="success-container">
          <div className="company-image-name-rating-container">
            <img
              alt="job details company logo"
              className="job-details-company-image"
              src={companyLogoUrl}
            />
            <div className="name-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="star-icon-container">
                <AiOutlineStar size={25} className="star-icon" />
                <h1 className="rating-heading">{rating}</h1>
              </div>
            </div>
          </div>
          <div className="job-location-type-package-container">
            <div className="location-type-container">
              <div className="icon-container">
                <ImLocation size={25} className="icon-image" />
                <p className="location">{location}</p>
              </div>
              <div className="icon-container">
                <BsBriefcaseFill size={25} className="icon-image" />
                <p className="type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="break-line" />
          <div className="description-visit-container">
            <h1 className="job-description-heading">Description</h1>
            <div className="icon-container">
              <h1 className="visit">Visit</h1>
              <BsBoxArrowUpRight size={25} className="visit-icon-image" />
            </div>
          </div>
          <div>
            <p className="job-description">{jobDescription}</p>
          </div>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <SkillsCard skillsDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-company-container">
            <p className="description-paragraph">{description}</p>
            <img
              src={imageUrl}
              className="website-image"
              alt="company-website"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobs.map(eachSimilarJob => (
            <SimilarJobCard
              similarJobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong </h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickJobsList}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader
        testid="loader"
        type="ThreeDots"
        color="#0b69ff"
        height="50"
        width="50"
      />
    </div>
  )

  renderJobDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-details-container">
        <Header />
        <div className="jobs-item-details-container">
          {this.renderJobDetailsView()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
