using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class Aluno
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do aluno é obrigatório.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O email do aluno é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")]
        [StringLength(100, ErrorMessage = "O email não pode exceder 100 caracteres.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        [DataType(DataType.Date)] // Garante que apenas a data seja considerada
        // Adicionar validação de idade mínima/máxima se necessário
        public DateTime DataNascimento { get; set; }

        // Adicionando a propriedade Matrícula que estava no frontend mas não no modelo
        [Required(ErrorMessage = "A matrícula é obrigatória.")]
        [RegularExpression("^[0-9]+$", ErrorMessage = "A matrícula deve conter apenas números.")]
        [StringLength(20, ErrorMessage = "A matrícula não pode exceder 20 caracteres.")]
        public string Matricula { get; set; } // Adicionado campo Matrícula
    }
}

