// you may use the following page to test:
// http://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2Fb9728349aa850f575f594496a2a38233%2Fview.json&loadversion=true&fillsearch=Twig+dynamic+form+experiments

module.exports = `

<style>
    #biologyForm .addRow {
        color: green;
        font-weight: bold;
        font-size: 12px;
        padding: .3em .5em;
    }
    #biologyForm .removeRow {
        color: red;
        font-weight: bold;
        font-size: 12px;
        padding: .3em .5em;
    }

    #biologyForm input[type=number] {
        width: 50px;
    }
    #biologyForm > table > tbody > tr > th {
        font-size:18px;
    }
</style>


<div id='biologyForm'>
    <h1>Peptidic sequences</h1>
    
    <table>
        <tr data-repeat='peptidic'>
            <td>
                <table>
                    <tr data-repeat='seq'>
                        <td>
                            Name: <input data-field='name' size=40>
                            Type: <select data-field='moleculeType'>
                                <option value=''></option>
                                <option value='Peptide'>Peptide</option>
                                <option value='Protein'>Protein</option>
                                <option value='Antibody'>Antibody</option>
                                <option value='Antibody light chain'>Antibody light chain</option>
                                <option value='Antibody heavy chain'>Antibody heavy chain</option>
                               </select>
                            
                            <br>
                            <div style='display: flex'>
                                N<sub>term</sub>
                                <textarea cols=80 rows=7 data-field='sequence'></textarea>
                                C<sub>term</sub>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
    <h1>Nucleic sequences</h1>
        <table>
        <tr data-repeat='nucleic'>
            <td>
                <table>
                    <tr data-repeat='seq'>
                        <td>
                            Name: <input data-field='name' size=40><br>
                            Type: <select data-field='moleculeType'>
                                <option value=''></option>
                                <option value='DNA'>DNA</option>
                                <option value='ds-DNA'>ds-DNA</option>
                                <option value='RNA'>RNA</option>
                            </select>&nbsp;
                            5': <select data-field='fivePrime'>
                                <option value='Alcohol'>Alcohol</option>
                                <option value='Monophosphate'>Monophosphate</option>
                                <option value='Diphosphate'>Diphosphate</option>
                                <option value='Triphosphate'>Triphosphate</option>
                            </select>
                            - Primer:
                            <input type='checkbox' data-field='primer'>
                            - Circular: 
                            <input type='checkbox' data-field='circular'>
                            <br>
                            <div style='display: flex'>
                                <span>5'</span>
                                <textarea cols=80 rows=7 data-field='sequence'></textarea>
                                <span>3'</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>

<script>
    require(['vh/util/twigAdvancedForm'], function(AF) {
        AF('biologyForm', {debug:true});
    });
</script>


`;
