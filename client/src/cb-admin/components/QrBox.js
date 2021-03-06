import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PrimaryButton } from '../../shared/components/form/base';
import { fonts } from '../../shared/style_guide';


const Container = styled.div`
  height: 11em;
  width: 90%;
`;

const Img = styled.img`
  height: 11em;
  width: 50%;
  object-fit: contain;
  object-position: center;
  display: block;
`;

const Button = PrimaryButton.extend`
  width: 45%;
  margin: 0 2.5%;
  height: 4.5em;
  font-size: ${fonts.size.small};
`;


const QrBox = ({ qrCodeUrl, print, send, hasSent }) => (
  <Container>
    <Img alt="QR code" src={qrCodeUrl} />
    <Button onClick={print}>PRINT QR CODE</Button>
    <Button onClick={send} disabled={hasSent}>
      {
        hasSent
          ? 'QR CODE SENT'
          : 'RESEND QR CODE'
      }
    </Button>
  </Container>
);


QrBox.propTypes = {
  qrCodeUrl: PropTypes.string.isRequired,
  print: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  hasSent: PropTypes.bool,
};

QrBox.defaultProps = {
  hasSent: false,
};


export default QrBox;
