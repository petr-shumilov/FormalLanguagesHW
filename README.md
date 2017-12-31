# FormalLanguagesParsers
- 1_matrix_method 
- 2_gll
- 3_bottom_up
## Requirements:
- nodejs (version >8.0.0) 
- npm 

### How to install nodejs 8.x:
``` 
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
``` 
## Input format:
- 1_matrix_method  [grammar in Chomsky normal form] [graph] 
- 2_gll  [recursive finite automaton] [graph]
- 3_bottom_up  [recursive finite automaton] [graph]
## Run:
``` 
nodejs 1_matrix_method/index.js grammars/q1_grammar.txt graphs/travel.dot matrix_res.txt
```

```
nodejs 2_gll/index.js rfa/rfa_1.dot graphs/travel.dot gll_res.txt
```

```
nodejs 3_bottom_up/index.js rfa/rfa_2.dot graphs/travel.dot glr_res.txt
```
## Test:
``` 
nodejs test.js matrix
```

```
nodejs test.js glr
```

```
nodejs test.js glr
```
