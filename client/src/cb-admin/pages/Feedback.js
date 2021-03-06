import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/initialize';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import styled from 'styled-components';
import { CbAdmin } from '../../api';
import { PrimaryButton } from '../../shared/components/form/base';
import { Heading, Link, Paragraph } from '../../shared/components/text/base';
import { colors } from '../../shared/style_guide';

const FeedbackPrimaryButton = PrimaryButton.extend`
  width: auto;
  margin-left: 2rem;
  padding: 0.5rem;
`;

const FeedbackParagraph = Paragraph.extend`
  display: inline-block;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InvisibleDiv = styled.div`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  display: inline-block;
  margin-left: 2rem;
`;
const DoughnutContainer = styled.div`
  margin-top: 2rem;
`;

const feedbackColors = [
  {
    feedback_score: -1,
    label: 'Unsatisfied',
    backgroundColor: colors.highlight_secondary,
    hoverBackgroundColor: colors.hover_secondary,
  },
  {
    feedback_score: 0,
    label: 'Neutral',
    backgroundColor: colors.light,
    hoverBackgroundColor: colors.dark,
  },
  {
    feedback_score: 1,
    label: 'Satisfied',
    backgroundColor: colors.highlight_primary,
    hoverBackgroundColor: colors.hover_primary,
  },
];

const doughnutConfig = (colorConfig, feedbackCountArray) => ({
  labels: feedbackColors.map(el => el.label),
  datasets: [
    {
      data: feedbackColors.map(
        el => feedbackCountArray.filter(
          feedbackCount => feedbackCount.feedback_score === el.feedback_score,
        )[0].count,
      ),
      backgroundColor: feedbackColors.map(el => el.backgroundColor),
      hoverBackgroundColor: feedbackColors.map(el => el.hoverBackgroundColor),
    },
  ],
});

const logout = props => () => {
  localStorage.removeItem('token');
  props.updateLoggedIn();
};

const lastCallStates = {
  ALL: 'ALL',
  DATERANGEPICKER: 'DATERANGEPICKER',
};

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
      startDate: null,
      endDate: null,
      focusedInput: null,
      lastCall: null,
      showDatePicker: false,
    };
  }

  componentDidMount() {
    this.handleGetFeedback();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focusedInput !== this.state.focusedInput
        && !this.state.focusedInput
        && this.state.startDate
        && this.state.endDate) {
      this.handleGetFeedback();
    }

    if (prevState.lastCall === lastCallStates.DATERANGEPICKER
        && this.state.lastCall === lastCallStates.ALL) {
      this.handleGetFeedback();
    }
  }

  handleGetFeedback = () => {
    CbAdmin.getFeedback(this.props.auth, this.state.startDate, this.state.endDate)
      .then(({ data }) => {
        data.result[0] //eslint-disable-line
          ? this.setState({ data, error: null })
          : this.setState({ error: 'Sorry, no data was found', data: null });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.props.history.push('/admin/login');
        }
        this.setState({ error: 'Sorry there has been an error with your request' });
      });
  };

  handleAllDates = () => {
    this.setState({
      startDate: null,
      endDate: null,
      lastCall: lastCallStates.ALL,
    });
  };

  render() {
    return (
      <div>
        <StyledNav>
          <Link to="/admin" onClick={this.removeAdmin}>
            Back to dashboard
          </Link>
          <Heading>Visitor Satisfaction</Heading>
          <Link to="/cb/login" onClick={logout(this.props)}>
            Logout
          </Link>
        </StyledNav>

        <div>
          <FeedbackParagraph displayInline>View:</FeedbackParagraph>
          <FeedbackPrimaryButton onClick={this.handleAllDates}>All dates</FeedbackPrimaryButton>
          <FeedbackPrimaryButton
            onClick={() => this.setState({ showDatePicker: !this.state.showDatePicker })}
          >
            Dates between...
          </FeedbackPrimaryButton>
          <InvisibleDiv visible={this.state.showDatePicker}>
            <DateRangePicker
              orientation={'vertical'}
              isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
              startDate={this.state.startDate}
              startDateId="start_date_id"
              endDate={this.state.endDate}
              endDateId="end_date_id"
              onDatesChange={({ startDate, endDate }) =>
                this.setState({ startDate, endDate, lastCall: lastCallStates.DATERANGEPICKER })
              }
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
          </InvisibleDiv>
        </div>

        {this.state.data
          ? <DoughnutContainer>
            <Doughnut data={doughnutConfig(feedbackColors, this.state.data.result)} />
          </DoughnutContainer>
          : <h2>{this.state.error}.</h2>
        }
      </div>
    );
  }
}

Feedback.propTypes = {
  auth: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
