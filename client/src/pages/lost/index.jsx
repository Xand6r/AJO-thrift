import React from 'react';
import { Link } from 'react-router-dom';
import Lost from "../../assets/lost.svg";

export default function index() {
    return (
        <div style={{
            'width': '100%',
            'height': '100%',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            "flex-direction": 'column'
        }}>
            <img
                style={{
                    width:'50%',
                    marginTop:"50px",
                    marginBottom:"50px"
                }}
                src={Lost}
                alt=""
            />
            <h3>
                You appear to be lost. click <Link to="/">here</Link> to go back to the home page
            </h3>
        </div>
    )
}
