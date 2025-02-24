import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const HIGHLIGHT_COLORS : {YELLOW:string,BLUE:string ,DEFAULT: string} = {
  YELLOW: '#FFD700',
  BLUE: '#0000FF',
  DEFAULT: '#E6E6E6',
};

interface Iprops {
  number: number;
  color?: string;
  position: {top: number; left: number};
  isClick: boolean
}
interface SelectDropdown {
  value: string;
  label?: string;
}

interface Tooth {
  number: number;
  position: {
    top: number;
    left: number;
  };
  color?: string;
}

// interface TeethData {
//   upper: Tooth[];
// }


const TEETH_DATA: any = 
  [
    {number: 32, position: {top: 390, left: 0},isClick: false,},
    {number: 31, position: {top: 352, left: 0}, isClick: false},
    {number: 30, position: {top: 318, left: 2},isClick: false},
    {number: 29, position: {top: 280, left: 8},isClick: false},
    {number: 28, position: {top: 244, left: 21},isClick: false},
    {number: 27, position: {top: 210, left: 41},isClick: false},
    {number: 26, position: {top: 180, left: 65},isClick: false},
    {number: 25, position: {top: 160, left: 100},isClick: false},
    {number: 24, position: {top: 160, left: 141},isClick: false},
    {number: 23, position: {top: 180, left: 175},isClick: false},
    {number: 22, position: {top: 210, left: 198},isClick: false},
    {number: 21, position: {top: 244, left: 215},isClick: false},
    {number: 20, position: {top: 278, left: 230},isClick: false},
    {number: 19, position: {top: 314, left: 240},isClick: false},
    {number: 18, position: {top: 352, left: 250},isClick: false},
    {number: 17, position: {top: 390, left: 255},isClick: false},
  ]


const App = () => {
  const slideAnim = useRef(new Animated.Value(500)).current; 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [problem1, setProblem1] = useState<string>('');
  const [problem2, setProblem2] = useState<string>('');
  const [openProblem1, setOpenProblem1] = useState(false);
  const [openProblem2, setOpenProblem2] = useState(false);
  const [notes, setNotes] = useState('');
  const [teethData,setTeethData] = useState([...TEETH_DATA]);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const closingSectionHandler = () => {
    setModalVisible(false);
    setProblem1('');
    setProblem2('');
    setNotes('');
  
    setTeethData(prevTeeth =>
      prevTeeth.map(tooth =>
        tooth.number === selectedTooth
          ? { ...tooth, color: HIGHLIGHT_COLORS.BLUE }
          : tooth
      )
    );
  };
  


  const handleSubmitForm = () => {
    if (!problem1) {
     Alert.alert('Please select the first problem.','');
      return;
    }
    if (!problem2) {
      Alert.alert('Please select the second problem.');
      return;
    }
  
    // Payload creation.
    const result = { firstDisease: problem1, secondDisease: problem2, note: notes };
    console.log('Result:', result);
    if(result){
      // Alert.alert('Sended Successfully');
      Alert.alert(  
        'Successfully',  
        'Sended Successfully',  
        [  
            
          {text: 'OK', onPress:closingSectionHandler}, 
        ],
        {cancelable: false}  
    ) 
    }
  };

  const Tooth = ({ number, color = HIGHLIGHT_COLORS.DEFAULT, position,isClick }: Iprops) => (
    <TouchableOpacity
      style={[styles.tooth, { backgroundColor: isClick ?  'blue' : '', top: position.top, left: position.left }]}
      onPress={() => toothHandler(number)}
      disabled={modalVisible}
    >
      <Text style={styles.toothText}>{number}</Text>
    </TouchableOpacity>
  );
  
  const toothHandler = (number: number) => {
    if (modalVisible) return;
  
    setSelectedTooth(number);
    setModalVisible(true);
  
    setTeethData(prevTeeth =>
      prevTeeth.map(item =>
        item.number === number
          ? { ...item, isClick: true }
          : { ...item, isClick: false }
      )
    );
  };

  useEffect(() => {
    if (!modalVisible) {
      const data = TEETH_DATA.map((item: any) => ({ ...item, color: '' }))
      setTeethData(data);
    }
  }, [modalVisible]);
  

  return (
    <View style={styles.container}>
     
        <View style={styles.teethContainer}>
          {teethData.map(tooth => (
            <Tooth key={tooth.number} {...tooth} />
          ))}
        </View>
     

      {modalVisible && (
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {transform: [{translateY: slideAnim}]},
              ]}>
              <View style={styles.upperLeftTeeth}>
                <View style={styles.circle}>
                  <Text style={styles.teethCountSection}>
                    {selectedTooth ?? ''}
                  </Text>
                </View>
                <Text style={styles.modalTitle}>Upper Left Teeth</Text>
              </View>

              {/*for Dropdowns */}
              <View style={{zIndex: openProblem2 ? 1000 : 2000}}>
                <DropDownPicker
                  open={openProblem1}
                  value={problem1}
                  items={[
                    {label: 'Tooth Decay', value: 'tooth_decay'},
                    {label: 'Gum Disease', value: 'gum_disease'},
                    {label: 'Cracked Tooth', value: 'cracked_tooth'},
                  ]}
                  setOpen={open => {
                    setOpenProblem1(open);
                    setOpenProblem2(false);
                  }}
                  onSelectItem={item => setProblem1(item?.value ?? '')}
                  placeholderStyle={{color: 'grey'}}
                  placeholder="1st Problem"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              <View style={{zIndex: openProblem1 ? 1000 : 2000}}>
                <DropDownPicker
                  open={openProblem2}
                  value={problem2}
                  items={[
                    {label: 'Tooth Decay', value: 'tooth_decay'},
                    {label: 'Gum Disease', value: 'gum_disease'},
                    {label: 'Cracked Tooth', value: 'cracked_tooth'},
                  ]}
                  setOpen={open => {
                    setOpenProblem2(open);
                    setOpenProblem1(false); 
                  }}
                  onSelectItem={item => setProblem2(item?.value ?? '')}
                  placeholderStyle={{color: 'grey'}}
                  placeholder="2nd Problem"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>

              {/*for  Notes */}
              <View style={styles.noteTextContainer}>
                <Text style={styles.notesLabel}>Notes </Text>
                <Text style={styles.notesLabelOptional}>(optional)</Text>
              </View>

              <TextInput
                style={[
                  styles.notesInput,
                  {backgroundColor: '#FDECEC', color: '#D77A7A'},
                ]}
                placeholder="Type your concerns here...."
                placeholderTextColor="#D77A7A"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        {/* <View style={{flex: 1, flexDirection: 'row'}}> */}
          <TouchableOpacity
            style={styles.nextButton}
            >
            <Text style={styles.nextText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmitForm}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        {/* </View> */}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
  },
  teethContainer: {position: 'relative', width: 300, height: 300},
  tooth: {
    position: 'absolute',
    width: 30,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toothText: {fontSize: 12, fontWeight: 'bold'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', paddingLeft: 15},
  upperLeftTeeth: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: 12,
  },
  circle: {
    width: 30,
    backgroundColor: 'blue',
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teethCountSection: {color: '#fff'},
  dropdown: {marginBottom: 10, borderColor: '#ccc', borderRadius: 17},
  secondDropdown: {marginBottom: 10, borderColor: '#ccc', borderRadius: 17},

  dropdownContainer: {width: '100%'},
  dropdownContainer1: {
    width: '100%',
    backgroundColor: 'white', 
    zIndex: 9999, 
  },
  dropdownContainer2: {
    width: '100%',
    backgroundColor: 'white', 
    zIndex: 1000, 
  },
  notesLabel: {fontWeight: 'bold'},
  notesLabelOptional :{color:'grey'},
  notesInput: {
    height: 110,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    // padding: 10,
    backgroundColor:'rgb(255 127 127)'
 
  },
  noteTextContainer: {flex:1,flexDirection: 'row'},
  buttonContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    maxHeight:'10%',
    // backgroundColor: 'purple',
    borderTopWidth: 1,
    borderColor: 'grey',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
  },
  cancelText: {color: '#888', fontSize: 16},
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0000FF',
    borderRadius: 20,
  },
  nextText: {color: '#FFF', fontSize: 16},
});

