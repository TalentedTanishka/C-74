import React from 'react';
import { Text, View,ScrollView, FlatList,TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import firebase from 'firebase';
import db from '../config'
export default class Searchscreen extends React.Component {

  constructor(props){
    super(props)

    this.state={
      allTransactions:[],
      lastTransaction: null,
      search : ''
    }
  }

  componentDidMount=async()=>{
    const ref = await db.collection("transactions").get();

    ref.docs.map(doc=>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()]
      })
      console.log("data",this.state.allTransactions)
    })
  }
fetchMoreTransaction=async()=>{
  if(this.state.lastTransaction!==null)
  {
  const ref = await db.collection("transactions").startAfter(this.state.lastTransaction).limit(10).get()

  ref.docs.map(doc =>{
    this.setState({
      allTransactions:[...this.state.allTransactions,doc.data()],
      lastTransaction:doc
    })
  })
}
}

searchTransaction=async(text)=>{
  var enterText = text.split('')
  if(enterText[0].toUpperCase() === 'B' && this.state.lastTransaction !== null)
  {
    const ref = await db.collection("transactions").where('bookid','==',text).startAfter(this.state.lastTransaction).limit(10).get()
    ref.docs.map(doc =>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastTransaction:doc
      })
    })
  }else if(enterText[0].toUpperCase()=== 'S' && this.state.lastTransaction !== null)
  {
    const ref = await db.collection("transactions").where('studentid','==',text).startAfter(this.state.lastTransaction).limit(10).get()
    ref.docs.map(doc =>{
      this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastTransaction:doc
      })
    })
  }
  console.log(enterText)
}
    render() {
      return (
        /*
        <ScrollView>
          {this.state.allTransactions.map((iteam,index)=>{
            console.log(iteam)
           
           if(iteam != null)
           {

           
            return(
             
              <View style={{borderBottomWidth : 2}} key={index}>
                <Text> {"transaction type : "+ iteam.transactiontype}</Text>
                <Text> {"student id : "+ iteam.studentid}</Text>
                <Text> {"book id : "+ iteam.bookid}</Text>
                <Text> {"date : "+ iteam.date.toDate()}</Text>
              </View>
            
            )
          }
          }
         
          )

        }
        </ScrollView>
        */

        <View style={styles.container}> 
          <View style={styles.searchBar}>
            <TextInput 
            style={styles.bar}
            placeholder='Enter book id or student id'
            onChangeText={(text)=>{
              this.setState({
                search:text
              })
            }}
            />
             
             <TouchableOpacity style={styles.searchButton} onPress={()=>{
               this.searchTransaction(this.state.search)
             }}>
            <Text>
              Search
            </Text>
          </TouchableOpacity>

          </View>

         
        
       <FlatList data= {this.state.allTransactions} renderItem={({item})=>(
         <View style={{borderBottomWidth : 2}}>
            <Text> {"transaction type : "+ item.transactiontype}</Text>
                <Text> {"student id : "+ item.studentid}</Text>
                <Text> {"book id : "+ item.bookid}</Text>
                <Text> {"date : "+ item.date.toDate()}</Text>
         </View>
       )} keyExtractor={(item,index)=>
         index.toString()
       } onEndReached={this.fetchMoreTransaction} onEndReachedThreshold={0.7}/>
</View>
      
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })