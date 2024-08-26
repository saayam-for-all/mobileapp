import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, Text, View, Modal, Button} from 'react-native';

const RequestsTable = ({ data }) => {
  const [sortAscending, setSortAscending] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 4, 5]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [column, setColumn] =React.useState();
  const [isVisible,setVisible] = React.useState(false);
  const toggleVisibility = () => setVisible(!isVisible);
  const [idBasic, setIdBasic] = React.useState();
  const [reqColor, setReqColor] = React.useState('black');

  const showModalBasic = (id, status, category) => {
    toggleVisibility();
    setIdBasic('' + id + '\nStatus: ' + status + '\nCategory: ' + category);
  }

  const [items] = React.useState(data);

  const sortedItems = items
    .slice()
    .sort((item1, item2) =>
      sortAscending
        ? item1.creationDate.localeCompare(item2.creationDate)
        : item2.creationDate.localeCompare(item1.creationDate)
    );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    
    <DataTable>
      <Text style={styles.tabText}>My requests</Text>
      <DataTable.Header>
        <DataTable.Title numberOfLines={2} textStyle={{fontWeight:"bold"}}>Id</DataTable.Title>
        <DataTable.Title style={styles.first} textStyle={{fontWeight:"bold"}}>Requests</DataTable.Title>
        <DataTable.Title sortDirection={sortAscending ? 'ascending' : 'descending'}
              onPress={() => setSortAscending(!sortAscending)} numberOfLines={2}>Date created</DataTable.Title>
      </DataTable.Header>

      {sortedItems.slice(from, to).map((item) => (
       
        <DataTable.Row key={item.id}>      
          <DataTable.Cell onPress={() =>  showModalBasic(item.id, item.status, item.category)}>{item.id}</DataTable.Cell>
          <DataTable.Cell style={styles.first} >{item.subject}</DataTable.Cell>
          <DataTable.Cell numeric>{item.creationDate}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
       <Modal visible={isVisible} animationType="fade" transparent={true}>
    <View style={styles.modalView}>
        <View style={styles.alert}>
          <Text style={styles.alertTitle}>Request info</Text>
          <Text style={styles.alertMessage}><Text>Request id is {idBasic}</Text></Text>
          <View style={styles.alertButtonGroup}>
            <View style={styles.alertButton}>
                <Button title="OK" onPress={() => toggleVisibility()} />
            </View>
          </View>
        </View>
    </View>
</Modal>
    </DataTable>
    
  );
 
};

const styles = StyleSheet.create({
  first: {
    flex: 2,   
    fontSize: 10,
    //alignContent:'center',
    //justifyContent:'center'
  },
  tabText: {
    marginLeft: 24,  
    fontSize: 18,
    //alignContent:'center',
    //justifyContent:'center'
  },
  modalContainer:{
    backgroundColor:"#ccc",
    top:0,
    left:0,
    right:0,
    bottom:0,
    position:'absolute',
},
modalView:{
    flex:1,
    alignContent:'center',
    justifyContent:'center'
},
alert:{
    width:'100%',
    maxWidth:300,
    margin:48,
    elevation:24,
    borderRadius:2,
    backgroundColor:'#fff'
},
alertTitle:{
    margin:24,
    fontWeight:"bold",
    fontSize:24,
    color:"#000"
},
alertMessage:{
    marginLeft:24,
    marginRight:24,
    marginBottom:24,
    fontSize:16,
    color:"#000"
},
alertButtonGroup:{
    marginTop:0,
    marginRight:0,
    marginBottom:8,
    marginLeft:24,
    padding:10,
    display:"flex",
    flexDirection:'row',
    justifyContent:"flex-end"
},
alertButton:{
    marginTop:12,
    marginRight:8,
    width:100
},
});

export default RequestsTable;