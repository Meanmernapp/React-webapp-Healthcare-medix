import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { StyledEngineProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import apiInstance from "../../Api/axios";
import { GetPatient } from "../hospitalsettingStap/hospitalApi/hospitalApiSlice";
import MDButton from "../../components/MDButton";
import theme from "../../assets/Theme";
import { GetOPDPatient } from "../HMOpd/OpdAPi/opdReducer";
import Swal from 'sweetalert2'




function CustomPagination() {
  const dispatch = useDispatch();
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);




 
  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function ReceptionTable({rows}) {
    const dispatch=useDispatch()

    const columns = [
      { field: "id", headerName: "Sr#", width: 80 },
      {
        field: "patientName",
        headerName: "Name",
        minWidth: 150,
        flex: 1,
        editable: true,
      },
      {
        field: "fatherName",
        headerName: "Parent Name",
        minWidth: 150,
        flex: 1,
        editable: true,
      },
      {
        field: "age",
        headerName: "Age/Sex",
        editable: true,
        minWidth: 100,
        flex: 1,
      },
      {
        field: "doctor",
        headerName: "Doctor",
        width: 150,
        editable: true,
      },
      {
        field: "cnic",
        headerName: "NIC",
        width: 200,
        editable: true,
      },
      {
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        disableClickEventBubbling: true,
       
        renderCell: (params) => {
            const onClick = (e) => {
              const currentRow = params.row;
              const user=localStorage.getItem("user")
              Swal.fire({
                title: 'Are you sure?',
                text: `You want to Delete ${currentRow?.patientName}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Deleted!',
                    `${currentRow?.patientName} has been deleted.`,
                    'success'
                  )
                  console.log("selected data",currentRow)
                  await apiInstance.delete(`/patient/${currentRow?.id}?username=${user}`)
                  await dispatch(GetOPDPatient({page:1,pageSize:1000}));
                  toast.success(`${currentRow?.patientName} Deleted!`)
                }
              })
            };
           
            return (
              <Stack direction="row" spacing={2}>
                 <MDButton
        sx={{
          width: {  xs: "57px!important" },
          height: {  xs: "32px!important" },
          color: `${theme.palette.primary.main}`,
          fontSize:{xs:"1rem",md:"1.2rem",lg:"1.5rem"}
        }}
      >
        View
      </MDButton>
      <MDButton
        sx={{
          width: {  xs: "57px!important" },
          height: {  xs: "32px!important" },
          color: `${theme.palette.primary.main}`,
          background: `${theme.palette.mintcream.main}`,
        }}
        onClick={onClick}
      >
    <DeleteOutlineIcon sx={{
          fontSize:{xs:"1.8rem",lg:"2rem"}
    }}/>
      </MDButton>
               
              </Stack>
            );
        },
    },
    ];
  return (
    <>
    <StyledEngineProvider injectFirst>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          pagination
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{
            Pagination: CustomPagination,
          }}
          rows={rows}
          columns={columns}
          // checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(ids) => {
            console.log(ids);
          }}
          sx={{
            border: 0,
            color: "#757575",
            fontFamily: "GontserratRegular",
            WebkitFontSmoothing: "auto",
            letterSpacing: "normal",
            // "& .MuiDataGrid-row": {
            //     width: "1191px",
            //     height: "34px",
            //     background: "#FFFFFF",
            //     borderRadius: "27px",
            // },
            "& .MuiDataGrid-main": {
              borderRadius: `${theme.shape.primary}`,

              background: `${theme.palette.white.main}`,
            },
            "& .MuiDataGrid-iconSeparator": {
              display: "none",
            },
            // "& .MuiDataGrid-columnHeaders": {
            //     width: "1191px",
            //     minHeight: "34px",
            //     background: "#D5DFED",
            //     borderRadius: "20px",
            // },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: { xs: "12px", sm: "14px", md: "14px", xl: "20px" },
              minHeight: "34px",
              color: `${theme.palette.primary.main}`,
              fontFamily: "GontserratRegular",
            },
            // "& .MuiDataGrid-row.Mui-selected": {
            //     background: " #FFFFFF",
            //     border: "1px solid #73A0FF",
            //     borderRadius: " 27px",
            // },
            "& .MuiDataGrid-cell": {
              fontWeight: 400,
              lineHeight: "17px",
              color: `${theme.palette.black.main}`,
              fontFamily: "GontserratRegular",
              fontSize: { xs: "12px", sm: "14px", md: "14px", xl: "20px" },

              // boxSizing: "none",
              // borderBottom: "none",
            },
            // "& .MuiPaginationItem-root": {
            //     borderRadius: 0,
            // },
            "& .MuiDataGrid-footerContainer ": {
              border: "none",
              justifyContent: "center",
            },
            "& .MuiPagination-ul li:first-child button>svg ": {
              // display: "none",
            },
            "& .MuiPagination-ul li:first-child button::before": {},
          }}
        />
      </Box>
    </StyledEngineProvider>
</>
  );
}
// css-17jjc08-MuiDataGrid-footerContainer

export default ReceptionTable;
