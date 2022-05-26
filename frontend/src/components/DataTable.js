import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../styleComponents/dataTable.css'
import React, { useState } from 'react'
import FreshStartWarningModal from './FreshStartWarningModal';

export default function DataTable({result,progressData,totalDomainsCount,StartFreshSearch}) {

   const [showFreshStartWarningAlert, setshowFreshStartWarningAlert] = useState(false);

      const columns = [
        { field: 'domain', headerName: 'Domain', flex:1 ,
        description:
        'website domain name',
        headerClassName:'dataTable_header'
      },
        { field: 'indexed', headerName: 'is Indexed ?', minWidth: 200,
        description:
        'is domain indexed on google news ',
        headerClassName:'dataTable_header'
      },
      ];
  return (
    <div className='dataTableBody'>
        <div className="dataTable_result_summary">
                <h1 style={{fontWeight:'400'}}>Result summary</h1>
                <hr style={{margin:'10px 0'}}/>
                <p>we checked {progressData.checkedDomainsCount} out of {totalDomainsCount} domains in {Math.floor(progressData.timeElapsed/60)} min {progressData.timeElapsed%60} sec </p>
                 <p>Domains Indexed = {result.indexedCount} , Not indexed = {result.nonIndexedCount}
                  , Error / unfinished = {progressData.checkedDomainsCount - result.indexedCount - result.nonIndexedCount }
                 </p>       
        </div>
        <div className="dataTableBox">

    <DataGrid rows={result.rows} columns={columns} components={{ Toolbar: GridToolbar }} 
    disableSelectionOnClick 
    autoHeight
    disableColumnMenu 
    getRowClassName={(data)=> (data.row.indexed===true)? "dataTableRow_true":(data.row.indexed==false)?"dataTableRow_false":"dataTableRow_error"}
    
  
    />
        </div>
        <button className='analyseFreshBtn' onClick={()=>setshowFreshStartWarningAlert(true)}>Analyse more domains</button>
  {(showFreshStartWarningAlert)?<FreshStartWarningModal open={showFreshStartWarningAlert} setopen={setshowFreshStartWarningAlert} StartFreshSearch={StartFreshSearch}/>:""}
  </div>
  )
}
