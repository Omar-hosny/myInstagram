import React, { Component } from "react";
import { Link } from "react-router-dom";
import profile1 from "./profile1.png";
import girls from "./girls.jpeg";
import nicegirls from "./nicegirls.jpeg";
import cutegirl2 from "./cutegirl2.jpeg";
import people from "./people.jpg";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";

class Profile extends Component {
  // onSubmit(e) {
  //   e.preventDefault();
  //   this.props.createAvatar(avatar);
  // }

  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile } = this.props.profile;

    return (
      <div>
        <div className="container pl-3">
          <div className="row">
            <div className="col-md-3 p-5">
              <img
                src={profile.avatar}
                className="rounded-circle"
                style={{ width: "150px", marginRight: "5px" }}
              />
            </div>
            <div className="col-md-9  pt-5">
              <div className="d-flex justify-content-between align-items-baseline ">
                <div className="d-flex align-items-center  pb-3">
                  <div className="h4 pt-1">{profile.handle}</div>

                  <Link
                    to="/edit-profile"
                    className=" ml-3 btn btn-sm btn-light"
                  >
                    Edit profile
                  </Link>
                </div>
              </div>
              <div className="d-flex">
                <div className="pr-5">
                  <strong>4</strong> posts
                </div>
                <div className="pr-5">
                  <strong>{user.followers.length}</strong>
                  followers
                </div>
                <div className="pr-5">
                  <strong>{user.following.length}</strong>
                  following
                </div>
              </div>
              <div className="pt-4 font-weight-bold">
                <div>{user.name}</div>
                <div>{profile.website}</div>
                <div>{profile.location}</div>
                <div>{profile.bio}</div>
              </div>
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-md-4 pb-4">
              <img src={girls} />
            </div>
            <div className="col-md-4 pb-4">
              <img src={nicegirls} />
            </div>
            <div className="col-md-4 pb-4">
              <img src={cutegirl2} />
            </div>
            <div className="col-md-4 pb-4">
              <img src={people} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createAvatar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Profile);
