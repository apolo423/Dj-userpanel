import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome';

export default class Spinner extends Component {
    render() {
        return (
            <span>
                <FontAwesome
                    className='super-crazy-colors'
                    name='spinner'
                    size='1x'
                    spin
                    style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: "white",marginRight:'8px' }}
                />
            </span>
        )
    }
}


