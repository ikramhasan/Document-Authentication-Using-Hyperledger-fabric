import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Admin = () => {
    const getTranscripts = async ( ) => {
    const headers = {'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'};

    const response = await fetch('http://localhost:4000/api/transcripts', {
      method: 'GET',
      headers: headers,
    });

    const result = await response.json();

    return result;
    }

    const transcriptQuery = useQuery({
        queryKey: ['transcript'],
        queryFn: getTranscripts,
    });

    const sanitizedData = transcriptQuery.data?.data?.map((transcript) => transcript.Record);
    
    console.log(sanitizedData);

    const [columnDefs] = useState([
        { field: 'id' , flex: 1},
        { field: 'email' , flex: 1},
        { field: 'grade', flex: 1 }
    ])


  return (
    
        transcriptQuery.isLoading ? <div>Loading</div> : <div className="ag-theme-alpine"  style={{height: 600, width: '100%'}}>
        <AgGridReact 
            rowData={sanitizedData}
            columnDefs={columnDefs}>
        </AgGridReact>
    </div>
    
  )
}

export default Admin