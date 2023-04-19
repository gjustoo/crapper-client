import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // Grid version 1
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const decodeBase64Image = (dataString) => {
  const byteString = atob(dataString);
  const mimeString = "image/jpeg";
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeString });
  const url = URL.createObjectURL(blob);

  return url;
};

const getData = async (query) => {
  try {
    const response = await axios.get("http://localhost:3200/api/carAd/search",{ params: { title: query } });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};
const Team = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Use state to store the data and re-render the component when it changes
  const [data, setData] = useState([]);
  var query = "";
  if(props !== undefined) {
    query = (props.query === undefined || props.query == "") ? "" : props.query;
  }
  console.log("query: " + props.query);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(query === undefined || query === "" ? "" : query);
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [query]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {/* handle data null */}
        {data && data.length > 0 ? (
          data.map((item) => (
            <Grid item xs={2} sm={4} md={4} key={item.id}>
              <Item>
                <a href={item.url} target="_blank">
                  <img src={decodeBase64Image(item.img_data)} alt="" />
                </a>
                <div>{item.title}</div>
                <div>
                  {item.price}
                  {item.currency}
                </div>
              </Item>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            No data to display.
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Team;
